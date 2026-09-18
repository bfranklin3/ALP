#!/usr/bin/env python3
"""Split multi-symbol SVG sheets into one SVG file per symbol.

Typical workflow:
  1. Export line (or color) art from Illustrator/Inkscape as SVG.
  2. Run this script to emit one SVG per symbol.
  3. Export PNGs from each SVG (Inkscape, Illustrator, or rsvg-convert).

Strategies (--mode):
  groups  One output file per top-level drawable <g> (best for structured exports).
  auto    Cluster leaf drawables by bounding-box proximity (irregular layouts).
  grid    Fixed row/column grid (--cols/--rows required).

Examples:
  python3 scripts/split-svg-symbols.py sheet.svg output/symbols
  python3 scripts/split-svg-symbols.py sheet.svg output/symbols --mode auto --padding 0.08
  python3 scripts/split-svg-symbols.py sheet.svg output/symbols --mode grid --cols 5 --rows 3
"""
from __future__ import annotations

import argparse
import copy
import math
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path

SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

DRAW_TAGS = {
    f"{{{SVG_NS}}}path",
    f"{{{SVG_NS}}}rect",
    f"{{{SVG_NS}}}circle",
    f"{{{SVG_NS}}}ellipse",
    f"{{{SVG_NS}}}line",
    f"{{{SVG_NS}}}polyline",
    f"{{{SVG_NS}}}polygon",
    f"{{{SVG_NS}}}text",
    f"{{{SVG_NS}}}use",
    f"{{{SVG_NS}}}image",
}

SKIP_TAGS = {
    f"{{{SVG_NS}}}defs",
    f"{{{SVG_NS}}}metadata",
    f"{{{SVG_NS}}}title",
    f"{{{SVG_NS}}}desc",
    f"{{{SVG_NS}}}style",
    f"{{{SVG_NS}}}clipPath",
    f"{{{SVG_NS}}}mask",
    f"{{{SVG_NS}}}symbol",
    f"{{{SVG_NS}}}marker",
    f"{{{SVG_NS}}}pattern",
    f"{{{SVG_NS}}}linearGradient",
    f"{{{SVG_NS}}}radialGradient",
    f"{{{SVG_NS}}}filter",
}

NUMBER_RE = re.compile(r"[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?")
PATH_TOKEN_RE = re.compile(
    r"[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?"
)
TRANSFORM_RE = re.compile(
    r"(matrix|translate|scale|rotate|skewX|skewY)\s*"
    r"(\(([^)]*)\)|\s+([-+.\d eE]+)(?:\s+([-+.\d eE]+))?(?:\s+([-+.\d eE]+))?(?:\s+([-+.\d eE]+))?(?:\s+([-+.\d eE]+))?(?:\s+([-+.\d eE]+))?)"
)


@dataclass
class BBox:
    xmin: float
    ymin: float
    xmax: float
    ymax: float

    @property
    def width(self) -> float:
        return max(0.0, self.xmax - self.xmin)

    @property
    def height(self) -> float:
        return max(0.0, self.ymax - self.ymin)

    @property
    def area(self) -> float:
        return self.width * self.height

    @property
    def cx(self) -> float:
        return (self.xmin + self.xmax) / 2.0

    @property
    def cy(self) -> float:
        return (self.ymin + self.ymax) / 2.0

    def valid(self) -> bool:
        return math.isfinite(self.xmin) and self.width > 0 and self.height > 0

    def union(self, other: BBox) -> BBox:
        return BBox(
            min(self.xmin, other.xmin),
            min(self.ymin, other.ymin),
            max(self.xmax, other.xmax),
            max(self.ymax, other.ymax),
        )

    def expand(self, fraction: float, min_pad: float = 0.0) -> BBox:
        pad_x = max(min_pad, self.width * fraction)
        pad_y = max(min_pad, self.height * fraction)
        return BBox(self.xmin - pad_x, self.ymin - pad_y, self.xmax + pad_x, self.ymax + pad_y)

    def intersects(self, other: BBox) -> bool:
        return not (
            other.xmax < self.xmin
            or other.xmin > self.xmax
            or other.ymax < self.ymin
            or other.ymin > self.ymax
        )


@dataclass
class SymbolSlice:
    name: str
    elements: list[ET.Element]
    bbox: BBox


def parse_numbers(text: str | None) -> list[float]:
    if not text:
        return []
    return [float(value) for value in NUMBER_RE.findall(text)]


def parse_view_box(root: ET.Element) -> BBox | None:
    view_box = root.get("viewBox")
    if view_box:
        parts = parse_numbers(view_box)
        if len(parts) == 4:
            x, y, w, h = parts
            return BBox(x, y, x + w, y + h)
    width = float(root.get("width", "0").replace("px", "") or 0)
    height = float(root.get("height", "0").replace("px", "") or 0)
    if width > 0 and height > 0:
        return BBox(0, 0, width, height)
    return None


def multiply_matrix(a: list[float], b: list[float]) -> list[float]:
    return [
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5],
    ]


def identity_matrix() -> list[float]:
    return [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]


def parse_transform(text: str | None) -> list[float]:
    matrix = identity_matrix()
    if not text:
        return matrix
    for match in TRANSFORM_RE.finditer(text):
        kind = match.group(1)
        if match.group(3) is not None:
            values = parse_numbers(match.group(3))
        else:
            values = [float(v) for v in match.group(4, 5, 6, 7, 8, 9) if v is not None]
        if kind == "matrix" and len(values) == 6:
            current = values
        elif kind == "translate":
            tx = values[0] if values else 0.0
            ty = values[1] if len(values) > 1 else 0.0
            current = [1.0, 0.0, 0.0, 1.0, tx, ty]
        elif kind == "scale":
            sx = values[0] if values else 1.0
            sy = values[1] if len(values) > 1 else sx
            current = [sx, 0.0, 0.0, sy, 0.0, 0.0]
        elif kind == "rotate" and values:
            angle = math.radians(values[0])
            cos_a = math.cos(angle)
            sin_a = math.sin(angle)
            current = [cos_a, sin_a, -sin_a, cos_a, 0.0, 0.0]
            if len(values) >= 3:
                cx, cy = values[1], values[2]
                current = multiply_matrix([1, 0, 0, 1, cx, cy], current)
                current = multiply_matrix(current, [1, 0, 0, 1, -cx, -cy])
        else:
            continue
        matrix = multiply_matrix(matrix, current)
    return matrix


def apply_matrix(matrix: list[float], x: float, y: float) -> tuple[float, float]:
    return (
        matrix[0] * x + matrix[2] * y + matrix[4],
        matrix[1] * x + matrix[3] * y + matrix[5],
    )


def transform_bbox(bbox: BBox, matrix: list[float]) -> BBox:
    corners = [
        apply_matrix(matrix, bbox.xmin, bbox.ymin),
        apply_matrix(matrix, bbox.xmax, bbox.ymin),
        apply_matrix(matrix, bbox.xmin, bbox.ymax),
        apply_matrix(matrix, bbox.xmax, bbox.ymax),
    ]
    xs = [point[0] for point in corners]
    ys = [point[1] for point in corners]
    return BBox(min(xs), min(ys), max(xs), max(ys))


def bbox_from_points(points: list[tuple[float, float]]) -> BBox | None:
    if not points:
        return None
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    return BBox(min(xs), min(ys), max(xs), max(ys))


def path_endpoint_points(d: str | None) -> list[tuple[float, float]]:
    """Collect on-path points for bbox (ignore Bezier control points)."""
    if not d:
        return []
    tokens = PATH_TOKEN_RE.findall(d.strip())
    points: list[tuple[float, float]] = []
    index = 0
    command = "M"
    x = y = start_x = start_y = 0.0

    def consume_number() -> float:
        nonlocal index
        value = float(tokens[index])
        index += 1
        return value

    def append_point(px: float, py: float) -> None:
        nonlocal x, y
        x, y = px, py
        points.append((x, y))

    def read_xy(relative: bool) -> tuple[float, float]:
        px = consume_number()
        py = consume_number()
        if relative:
            px += x
            py += y
        append_point(px, py)
        return px, py

    while index < len(tokens):
        token = tokens[index]
        if not token.isalpha():
            index += 1
            continue
        command = token
        index += 1
        relative = command.islower()
        cmd = command.upper()

        if cmd == "M":
            read_xy(relative)
            start_x, start_y = x, y
            while index < len(tokens) and not tokens[index].isalpha():
                read_xy(relative)
        elif cmd == "L":
            while index < len(tokens) and not tokens[index].isalpha():
                read_xy(relative)
        elif cmd == "H":
            while index < len(tokens) and not tokens[index].isalpha():
                nx = consume_number() + (x if relative else 0.0)
                append_point(nx, y)
        elif cmd == "V":
            while index < len(tokens) and not tokens[index].isalpha():
                ny = consume_number() + (y if relative else 0.0)
                append_point(x, ny)
        elif cmd == "C":
            while index < len(tokens) and not tokens[index].isalpha():
                values = [consume_number() for _ in range(6)]
                if relative:
                    values = [
                        values[0] + x,
                        values[1] + y,
                        values[2] + x,
                        values[3] + y,
                        values[4] + x,
                        values[5] + y,
                    ]
                append_point(values[4], values[5])
        elif cmd == "S":
            while index < len(tokens) and not tokens[index].isalpha():
                values = [consume_number() for _ in range(4)]
                if relative:
                    values = [values[0] + x, values[1] + y, values[2] + x, values[3] + y]
                append_point(values[2], values[3])
        elif cmd == "Q":
            while index < len(tokens) and not tokens[index].isalpha():
                values = [consume_number() for _ in range(4)]
                if relative:
                    values = [values[0] + x, values[1] + y, values[2] + x, values[3] + y]
                append_point(values[2], values[3])
        elif cmd == "T":
            while index < len(tokens) and not tokens[index].isalpha():
                values = [consume_number() for _ in range(2)]
                if relative:
                    values = [values[0] + x, values[1] + y]
                append_point(values[0], values[1])
        elif cmd == "A":
            while index < len(tokens) and not tokens[index].isalpha():
                for _ in range(5):
                    consume_number()
                px = consume_number()
                py = consume_number()
                if relative:
                    px += x
                    py += y
                append_point(px, py)
        elif cmd == "Z":
            append_point(start_x, start_y)
    return points


def element_local_bbox(element: ET.Element) -> BBox | None:
    tag = element.tag
    if tag == f"{{{SVG_NS}}}path":
        points = path_endpoint_points(element.get("d"))
        if not points:
            numbers = parse_numbers(element.get("d"))
            if len(numbers) < 2:
                return None
            xs = numbers[0::2]
            ys = numbers[1::2]
        else:
            xs = [point[0] for point in points]
            ys = [point[1] for point in points]
        return BBox(min(xs), min(ys), max(xs), max(ys))
    if tag == f"{{{SVG_NS}}}rect":
        x = float(element.get("x", "0"))
        y = float(element.get("y", "0"))
        w = float(element.get("width", "0"))
        h = float(element.get("height", "0"))
        return BBox(x, y, x + w, y + h)
    if tag == f"{{{SVG_NS}}}circle":
        cx = float(element.get("cx", "0"))
        cy = float(element.get("cy", "0"))
        r = float(element.get("r", "0"))
        return BBox(cx - r, cy - r, cx + r, cy + r)
    if tag == f"{{{SVG_NS}}}ellipse":
        cx = float(element.get("cx", "0"))
        cy = float(element.get("cy", "0"))
        rx = float(element.get("rx", "0"))
        ry = float(element.get("ry", "0"))
        return BBox(cx - rx, cy - ry, cx + rx, cy + ry)
    if tag == f"{{{SVG_NS}}}line":
        x1 = float(element.get("x1", "0"))
        y1 = float(element.get("y1", "0"))
        x2 = float(element.get("x2", "0"))
        y2 = float(element.get("y2", "0"))
        return BBox(min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2))
    if tag in {f"{{{SVG_NS}}}polyline", f"{{{SVG_NS}}}polygon"}:
        numbers = parse_numbers(element.get("points"))
        if len(numbers) < 2:
            return None
        xs = numbers[0::2]
        ys = numbers[1::2]
        return BBox(min(xs), min(ys), max(xs), max(ys))
    if tag == f"{{{SVG_NS}}}text":
        x = float(element.get("x", "0"))
        y = float(element.get("y", "0"))
        return BBox(x, y, x + 1, y + 1)
    if tag == f"{{{SVG_NS}}}use":
        x = float(element.get("x", "0"))
        y = float(element.get("y", "0"))
        return BBox(x, y, x + 1, y + 1)
    return None


def element_bbox(element: ET.Element, parent_matrix: list[float]) -> BBox | None:
    matrix = multiply_matrix(parent_matrix, parse_transform(element.get("transform")))
    if element.tag == f"{{{SVG_NS}}}g":
        child_boxes = []
        for child in list(element):
            if child.tag in SKIP_TAGS:
                continue
            child_bbox = element_bbox(child, matrix)
            if child_bbox and child_bbox.valid():
                child_boxes.append(child_bbox)
        if not child_boxes:
            return None
        bbox = child_boxes[0]
        for child_bbox in child_boxes[1:]:
            bbox = bbox.union(child_bbox)
        return bbox
    local = element_local_bbox(element)
    if local is None:
        return None
    return transform_bbox(local, matrix)


def is_drawable(element: ET.Element) -> bool:
    return element.tag in DRAW_TAGS or element.tag == f"{{{SVG_NS}}}g"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "symbol"


def collect_group_slices(root: ET.Element) -> list[SymbolSlice]:
    slices: list[SymbolSlice] = []
    root_matrix = parse_transform(root.get("transform"))
    candidates: list[ET.Element] = []

    for child in list(root):
        if child.tag in SKIP_TAGS:
            continue
        if child.tag == f"{{{SVG_NS}}}g":
            candidates.append(child)
        elif is_drawable(child):
            wrapper = ET.Element(f"{{{SVG_NS}}}g")
            wrapper.append(copy.deepcopy(child))
            candidates.append(wrapper)

    if len(candidates) == 1 and candidates[0].tag == f"{{{SVG_NS}}}g":
        group = candidates[0]
        inner_groups = [node for node in list(group) if node.tag == f"{{{SVG_NS}}}g" and node.tag not in SKIP_TAGS]
        if len(inner_groups) >= 2:
            candidates = inner_groups

    for index, element in enumerate(candidates, start=1):
        bbox = element_bbox(element, root_matrix)
        if bbox is None or not bbox.valid():
            continue
        element_id = element.get("id") or ""
        name = slugify(element_id) if element_id else f"{index:02d}"
        slices.append(SymbolSlice(name=name, elements=[copy.deepcopy(element)], bbox=bbox))
    return slices


def collect_leaf_drawables(root: ET.Element) -> list[tuple[ET.Element, BBox]]:
    leaves: list[tuple[ET.Element, BBox]] = []

    def walk(node: ET.Element, matrix: list[float]) -> None:
        current_matrix = multiply_matrix(matrix, parse_transform(node.get("transform")))
        if node.tag == f"{{{SVG_NS}}}g":
            for child in list(node):
                if child.tag in SKIP_TAGS:
                    continue
                walk(child, current_matrix)
            return
        if node.tag in DRAW_TAGS:
            local = element_local_bbox(node)
            if local is None:
                return
            bbox = transform_bbox(local, current_matrix)
            if bbox.valid():
                leaves.append((copy.deepcopy(node), bbox))

    for child in list(root):
        if child.tag in SKIP_TAGS:
            continue
        walk(child, parse_transform(root.get("transform")))
    return leaves


def cluster_leaves(
    leaves: list[tuple[ET.Element, BBox]],
    *,
    gap_fraction: float,
    min_area: float,
) -> list[SymbolSlice]:
    if not leaves:
        return []
    canvas = leaves[0][1]
    for _, bbox in leaves[1:]:
        canvas = canvas.union(bbox)
    gap = max(canvas.width, canvas.height) * gap_fraction

    clusters: list[tuple[list[ET.Element], BBox]] = []
    for element, bbox in sorted(leaves, key=lambda item: (item[1].cy, item[1].cx)):
        if bbox.area < min_area:
            continue
        matched_index = None
        for index, (_, cluster_bbox) in enumerate(clusters):
            if cluster_bbox.expand(0.0, gap).intersects(bbox):
                matched_index = index
                break
        if matched_index is None:
            clusters.append(([element], bbox))
        else:
            elements, cluster_bbox = clusters[matched_index]
            elements.append(element)
            clusters[matched_index] = (elements, cluster_bbox.union(bbox))

    slices: list[SymbolSlice] = []
    for index, (elements, bbox) in enumerate(clusters, start=1):
        wrapper = ET.Element(f"{{{SVG_NS}}}g")
        for element in elements:
            wrapper.append(element)
        slices.append(SymbolSlice(name=f"{index:02d}", elements=[wrapper], bbox=bbox))
    return slices


def grid_slot_for_point(
    cx: float,
    cy: float,
    view_box: BBox,
    *,
    cols: int,
    rows: int,
    dense: bool,
) -> tuple[int, int]:
    if dense and cols > 1 and rows > 1:
        xstep = view_box.width / (2 * (cols - 1))
        ystep = view_box.height / (2 * (rows - 1))
        col = min(cols - 1, max(0, int((cx - view_box.xmin + xstep / 2) / xstep)))
        row = min(rows - 1, max(0, int((cy - view_box.ymin + ystep / 2) / ystep)))
        return row, col
    cell_w = view_box.width / cols
    cell_h = view_box.height / rows
    col = min(cols - 1, max(0, int((cx - view_box.xmin) / cell_w)))
    row = min(rows - 1, max(0, int((cy - view_box.ymin) / cell_h)))
    return row, col


def collect_grid_slices(
    root: ET.Element,
    *,
    cols: int,
    rows: int,
    dense: bool,
) -> list[SymbolSlice]:
    view_box = parse_view_box(root)
    if view_box is None:
        raise SystemExit("Grid mode requires a viewBox or width/height on the root SVG.")
    leaves = collect_leaf_drawables(root)
    if not leaves:
        return []

    buckets: dict[tuple[int, int], list[ET.Element]] = {}

    for element, bbox in leaves:
        row, col = grid_slot_for_point(
            bbox.cx,
            bbox.cy,
            view_box,
            cols=cols,
            rows=rows,
            dense=dense,
        )
        buckets.setdefault((row, col), []).append(element)

    slices: list[SymbolSlice] = []
    for row in range(rows):
        for col in range(cols):
            elements = buckets.get((row, col), [])
            if not elements:
                continue
            wrapper = ET.Element(f"{{{SVG_NS}}}g")
            for element in elements:
                wrapper.append(element)
            bbox = element_bbox(wrapper, identity_matrix())
            if bbox is None:
                continue
            index = row * cols + col + 1
            slices.append(SymbolSlice(name=f"{index:02d}", elements=[wrapper], bbox=bbox))
    return slices


def write_symbol_svg(
    template_root: ET.Element,
    symbol: SymbolSlice,
    output_path: Path,
    *,
    padding_fraction: float,
) -> None:
    bbox = symbol.bbox.expand(padding_fraction)
    new_root = ET.Element(
        f"{{{SVG_NS}}}svg",
        {
            "xmlns:xlink": XLINK_NS,
            "version": "1.1",
            "viewBox": f"{bbox.xmin:.4f} {bbox.ymin:.4f} {bbox.width:.4f} {bbox.height:.4f}",
            "width": f"{bbox.width:.4f}",
            "height": f"{bbox.height:.4f}",
        },
    )

    for tag in SKIP_TAGS:
        for node in template_root.findall(f".//{tag}"):
            if node.tag == f"{{{SVG_NS}}}defs":
                new_root.append(copy.deepcopy(node))
                break

    content_group = ET.SubElement(new_root, f"{{{SVG_NS}}}g")
    for element in symbol.elements:
        content_group.append(element)

    tree = ET.ElementTree(new_root)
    ET.indent(tree, space="  ")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)


def output_subdir(input_path: Path, *, mode: str, cols: int | None, rows: int | None) -> str:
    stem = slugify(input_path.stem)
    if mode == "grid" and cols and rows:
        return f"{stem}-grid-{cols}x{rows}"
    if mode != "auto":
        return f"{stem}-{mode}"
    return stem


def split_svg(
    input_path: Path,
    output_dir: Path,
    *,
    mode: str,
    padding_fraction: float,
    gap_fraction: float,
    min_area: float,
    cols: int | None,
    rows: int | None,
    dense_grid: bool,
) -> list[Path]:
    tree = ET.parse(input_path)
    root = tree.getroot()
    if root.tag != f"{{{SVG_NS}}}svg":
        raise SystemExit(f"Not an SVG root element: {input_path}")

    if mode == "groups":
        slices = collect_group_slices(root)
    elif mode == "grid":
        if not cols or not rows:
            raise SystemExit("Grid mode requires --cols and --rows.")
        slices = collect_grid_slices(root, cols=cols, rows=rows, dense=dense_grid)
    else:
        leaves = collect_leaf_drawables(root)
        slices = cluster_leaves(leaves, gap_fraction=gap_fraction, min_area=min_area)
        if len(slices) <= 1:
            slices = collect_group_slices(root)

    if not slices:
        raise SystemExit(f"No symbols found in {input_path}")

    stem = slugify(input_path.stem)
    written: list[Path] = []
    for index, symbol in enumerate(slices, start=1):
        suffix = symbol.name if symbol.name != f"{index:02d}" else f"{index:02d}"
        output_path = output_dir / f"{stem}-{suffix}.svg"
        write_symbol_svg(root, symbol, output_path, padding_fraction=padding_fraction)
        ET.parse(output_path)
        written.append(output_path)
    return written


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Input SVG (or directory of SVG files)")
    parser.add_argument("output_dir", type=Path, help="Directory for output SVG files")
    parser.add_argument(
        "--mode",
        choices=("auto", "groups", "grid"),
        default="auto",
        help="Split strategy (default: auto)",
    )
    parser.add_argument(
        "--padding",
        type=float,
        default=0.06,
        help="Padding around each symbol as a fraction of its bbox (default: 0.06)",
    )
    parser.add_argument(
        "--gap",
        type=float,
        default=0.02,
        help="Cluster gap for auto mode as a fraction of canvas size (default: 0.02)",
    )
    parser.add_argument(
        "--min-area",
        type=float,
        default=16.0,
        help="Ignore leaf shapes smaller than this bbox area in auto mode",
    )
    parser.add_argument("--cols", type=int, help="Grid columns (grid mode)")
    parser.add_argument("--rows", type=int, help="Grid rows (grid mode)")
    parser.add_argument(
        "--dense-grid",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Use half-spacing grid cells for tightly packed symbol sheets (grid mode, default: off)",
    )
    args = parser.parse_args()

    inputs = sorted(args.input.glob("*.svg")) if args.input.is_dir() else [args.input]
    if not inputs:
        raise SystemExit(f"No SVG files found at {args.input}")

    total = 0
    for input_path in inputs:
        subdir = output_subdir(
            input_path,
            mode=args.mode,
            cols=args.cols,
            rows=args.rows,
        )
        target_dir = args.output_dir / subdir
        written = split_svg(
            input_path,
            target_dir,
            mode=args.mode,
            padding_fraction=args.padding,
            gap_fraction=args.gap,
            min_area=args.min_area,
            cols=args.cols,
            rows=args.rows,
            dense_grid=args.dense_grid,
        )
        total += len(written)
        print(f"{input_path.name}: wrote {len(written)} symbol(s) -> {target_dir}")
    print(f"Done. {total} SVG file(s) total.")


if __name__ == "__main__":
    main()
