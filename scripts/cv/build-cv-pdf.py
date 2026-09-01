from __future__ import annotations

import json

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)


# =========================================================
# PATHS
# =========================================================

ROOT = Path(__file__).resolve().parents[2]

CV_DATA_PATH = (
    ROOT
    / "src"
    / "cv"
    / "cvData.json"
)

with CV_DATA_PATH.open(
    "r",
    encoding="utf-8",
) as cv_data_file:
    CV_DATA = json.load(
        cv_data_file
    )

OUTPUT_DIR = (
    ROOT
    / "public"
    / "downloads"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUT_PATH = (
    OUTPUT_DIR
    / "Moses-Thiongo-CV.pdf"
)


# =========================================================
# ARIMO FONT DISCOVERY
# =========================================================

def first_existing_path(
    candidates: list[Path],
) -> Path | None:
    for candidate in candidates:
        if candidate.exists():
            return candidate

    return None


WINDOWS_FONT_DIR = (
    Path.home()
    / "AppData"
    / "Local"
    / "Microsoft"
    / "Windows"
    / "Fonts"
)

LINUX_FONT_DIRS = [
    Path("/usr/share/fonts/truetype/arimo"),
    Path("/usr/share/fonts/truetype/croscore"),
    Path("/usr/share/fonts/truetype/msttcorefonts"),
    Path("/usr/local/share/fonts"),
]


ARIMO_REGULAR = first_existing_path(
    [
        WINDOWS_FONT_DIR
        / "Arimo-VariableFont_wght.ttf",

        WINDOWS_FONT_DIR
        / "Arimo-Regular.ttf",

        *[
            directory / "Arimo-Regular.ttf"
            for directory in LINUX_FONT_DIRS
        ],
    ]
)

ARIMO_BOLD = first_existing_path(
    [
        WINDOWS_FONT_DIR
        / "Arimo-Bold.ttf",

        *[
            directory / "Arimo-Bold.ttf"
            for directory in LINUX_FONT_DIRS
        ],
    ]
)

ARIMO_ITALIC = first_existing_path(
    [
        WINDOWS_FONT_DIR
        / "Arimo-Italic-VariableFont_wght.ttf",

        WINDOWS_FONT_DIR
        / "Arimo-Italic.ttf",

        *[
            directory / "Arimo-Italic.ttf"
            for directory in LINUX_FONT_DIRS
        ],
    ]
)

ARIMO_BOLD_ITALIC = first_existing_path(
    [
        WINDOWS_FONT_DIR
        / "Arimo-BoldItalic.ttf",

        *[
            directory / "Arimo-BoldItalic.ttf"
            for directory in LINUX_FONT_DIRS
        ],
    ]
)


required_fonts = {
    "Arimo-Regular":
        ARIMO_REGULAR,

    "Arimo-Bold":
        ARIMO_BOLD,

    "Arimo-Italic":
        ARIMO_ITALIC,

    "Arimo-BoldItalic":
        ARIMO_BOLD_ITALIC,
}


missing_fonts = [
    font_name
    for font_name, font_path
    in required_fonts.items()
    if font_path is None
]


if missing_fonts:
    raise SystemExit(
        "STOPPED: Required Arimo fonts "
        "could not be discovered:\n\n"
        + "\n".join(
            missing_fonts
        )
    )


for font_name, font_path in (
    required_fonts.items()
):
    pdfmetrics.registerFont(
        TTFont(
            font_name,
            str(font_path),
        )
    )


pdfmetrics.registerFontFamily(
    "Arimo",
    normal="Arimo-Regular",
    bold="Arimo-Bold",
    italic="Arimo-Italic",
    boldItalic="Arimo-BoldItalic",
)

# =========================================================
# REFERENCE-MEASURED PAGE GEOMETRY
# =========================================================

PAGE_WIDTH, PAGE_HEIGHT = (
    letter
)

LEFT_MARGIN = 50.2
RIGHT_MARGIN = 48.7

TOP_MARGIN = 34.0
BOTTOM_MARGIN = 37.0

CONTENT_WIDTH = (
    PAGE_WIDTH
    - LEFT_MARGIN
    - RIGHT_MARGIN
)


# =========================================================
# BRAND
# =========================================================

INK = colors.HexColor(
    "#1B1B1B"
)

BODY = colors.HexColor(
    "#333333"
)

MUTED = colors.HexColor(
    "#666666"
)

FAINT = colors.HexColor(
    "#848484"
)

BLUE = colors.HexColor(
    "#1F4E79"
)

RULE = colors.HexColor(
    "#D2D8DE"
)

HEADER_RULE = colors.HexColor(
    "#1F4E79"
)


# =========================================================
# LINKS
# =========================================================

PROFILE = CV_DATA["profile"]
PROFILE_LINKS = PROFILE["links"]

LINKS = {
    key: value["url"]
    for key, value in PROFILE_LINKS.items()
}



# =========================================================
# TEXT HELPERS
# =========================================================

def safe(
    value: str,
) -> str:
    return escape(
        value,
        {
            "'": "&apos;",
            '"': "&quot;",
        },
    )


def linked(
    label: str,
    url: str,
) -> str:
    return (
        f'<link href="{safe(url)}">'
        f'{safe(label)}'
        "</link>"
    )


# =========================================================
# EXACT TYPOGRAPHIC HIERARCHY
# =========================================================

NAME = ParagraphStyle(
    "Name",
    fontName="Arimo-Bold",
    fontSize=22,
    leading=25,
    textColor=BLUE,
    alignment=TA_CENTER,
    spaceAfter=0,
)


HEADLINE = ParagraphStyle(
    "Headline",
    fontName="Arimo-Regular",
    fontSize=8,
    leading=10.2,
    textColor=INK,
    alignment=TA_CENTER,
    spaceBefore=0,
    spaceAfter=0,
)


CONTACT = ParagraphStyle(
    "Contact",
    fontName="Arimo-Regular",
    fontSize=8,
    leading=10.2,
    textColor=INK,
    alignment=TA_CENTER,
    spaceBefore=0,
    spaceAfter=0,
)


LANGUAGES = ParagraphStyle(
    "Languages",
    fontName="Arimo-Regular",
    fontSize=8,
    leading=10.2,
    textColor=FAINT,
    alignment=TA_CENTER,
    spaceBefore=0,
    spaceAfter=0,
)


SECTION = ParagraphStyle(
    "Section",
    fontName="Arimo-Bold",
    fontSize=11,
    leading=13.2,
    textColor=BLUE,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=3.0,
    keepWithNext=True,
)


BODY_TEXT = ParagraphStyle(
    "BodyText",
    fontName="Arimo-Regular",
    fontSize=9.5,
    leading=10.9,
    textColor=BODY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
)


CORE_LINE = ParagraphStyle(
    "CoreLine",
    fontName="Arimo-Regular",
    fontSize=9.5,
    leading=10.9,
    textColor=BODY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
)


ROLE = ParagraphStyle(
    "Role",
    fontName="Arimo-Bold",
    fontSize=10.5,
    leading=12.4,
    textColor=INK,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
    keepWithNext=True,
)


ROLE_META = ParagraphStyle(
    "RoleMeta",
    fontName="Arimo-Regular",
    fontSize=9,
    leading=10.6,
    textColor=BODY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=1.0,
    keepWithNext=True,
)


BULLET = ParagraphStyle(
    "Bullet",
    fontName="Arimo-Regular",
    fontSize=9.5,
    leading=10.9,
    textColor=BODY,
    alignment=TA_LEFT,

    # Compact hanging indent for résumé bullets.
    leftIndent=10,
    firstLineIndent=-7,

    spaceBefore=0,
    spaceAfter=0.3,
)


SELECTED_TITLE = ParagraphStyle(
    "SelectedTitle",
    fontName="Arimo-Bold",
    fontSize=9.5,
    leading=11.2,
    textColor=INK,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
    keepWithNext=True,
)


EDUCATION_TITLE = ParagraphStyle(
    "EducationTitle",
    fontName="Arimo-Bold",
    fontSize=10.5,
    leading=12.4,
    textColor=INK,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
    keepWithNext=True,
)


EDUCATION_META = ParagraphStyle(
    "EducationMeta",
    fontName="Arimo-Regular",
    fontSize=9,
    leading=10.6,
    textColor=BODY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
)


EDUCATION_RESEARCH = ParagraphStyle(
    "EducationResearch",
    fontName="Arimo-Italic",
    fontSize=9,
    leading=10.6,
    textColor=BODY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
)


EDUCATION_AWARD = ParagraphStyle(
    "EducationAward",
    fontName="Arimo-Italic",
    fontSize=9,
    leading=10.6,
    textColor=BLUE,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=0,
)


CERT = ParagraphStyle(
    "Certification",
    fontName="Arimo-Regular",
    fontSize=9,
    leading=10.6,
    textColor=BODY,
    alignment=TA_LEFT,
    leftIndent=10,
    firstLineIndent=-7,
    spaceBefore=0,
    spaceAfter=0.4,
)


FOOTER = ParagraphStyle(
    "Footer",
    fontName="Arimo-Regular",
    fontSize=7,
    leading=8.5,
    textColor=FAINT,
    alignment=TA_LEFT,
)


# =========================================================
# CV DATA ADAPTER
# =========================================================

def format_cv_month(
    value: str | None,
) -> str:
    if not value:
        return ""

    year, month = value.split(
        "-",
        1,
    )

    month_names = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
    }

    return (
        f"{month_names[month]} "
        f"{year}"
    )


def experience_for_pdf(
    records: list[dict],
) -> list[dict]:
    pdf_records = []

    for record in records:
        start = format_cv_month(
            record.get("startDate")
        )

        if record.get("current"):
            end = "Present"
        else:
            end = format_cv_month(
                record.get("endDate")
            )

        dates = start

        if end:
            dates = (
                f"{start} - {end}"
            )

        pdf_records.append(
            {
                "title":
                    record["title"],

                "organization":
                    record["organization"],

                "location":
                    record["location"],

                "dates":
                    dates,

                "bullets":
                    record.get(
                        "highlights",
                        [],
                    ),
            }
        )

    return pdf_records


def education_for_pdf(
    records: list[dict],
) -> list[dict]:
    pdf_records = []

    for record in records:
        pdf_records.append(
            {
                "degree":
                    record["qualification"],

                "date":
                    format_cv_month(
                        record["completedAt"]
                    ),

                "institution":
                    record["institution"],

                "location":
                    record["location"],

                "research":
                    record.get(
                        "thesisOrProject"
                    ),

                "research_label":
                    record.get(
                        "thesisOrProjectLabel",
                        "Research",
                    ),

                "advisors":
                    record.get(
                        "advisors",
                        [],
                    ),

                "advisor_label":
                    record.get(
                        "advisorLabel",
                        "Advisor",
                    ),

                "award":
                    record.get(
                        "award"
                    ),
            }
        )

    return pdf_records


def core_expertise_for_pdf(
    groups: list[dict],
) -> list[tuple[str, str]]:
    return [
        (
            f"{group['title']}:",
            " · ".join(
                group.get(
                    "skills",
                    [],
                )
            ),
        )
        for group in groups
    ]


def certifications_for_pdf(
    records: list[dict],
) -> list[tuple[str, str, str, str]]:
    return [
        (
            record["issuer"],
            record["title"],
            format_cv_month(
                record["completedAt"]
            ),
            record.get(
                "url",
                "",
            ),
        )
        for record in records
        if record.get(
            "featured",
            False,
        )
    ]


# =========================================================
# CV CONTENT
# =========================================================

PROFESSIONAL_SUMMARY = (
    CV_DATA["profile"]["summary"]
)


CORE_EXPERTISE = core_expertise_for_pdf(
    CV_DATA["skillGroups"]
)


EXPERIENCE = experience_for_pdf(
    CV_DATA["experience"]
)


SELECTED_EXPERTISE = CV_DATA[
    "selectedExpertise"
]


EDUCATION = education_for_pdf(
    CV_DATA["education"]
)


CERTIFICATIONS = certifications_for_pdf(
    CV_DATA["credentials"]
)


# =========================================================
# FLOWABLE BUILDERS
# =========================================================

def section(
    title: str,
):
    return [
        Spacer(
            1,
            8.5,
        ),
        Paragraph(
            safe(
                title.upper()
            ),
            SECTION,
        ),
    ]


def experience_block(
    role: dict,
):
    bullets = role.get(
        "bullets",
        [],
    )

    opening = [
        Paragraph(
            safe(
                role["title"]
            ),
            ROLE,
        ),

        Paragraph(
            (
                f"{safe(role['organization'])} | "
                f"{safe(role['location'])} | "
                f"{safe(role['dates'])}"
            ),
            ROLE_META,
        ),
    ]

    if bullets:
        opening.append(
            Paragraph(
                f"• {safe(bullets[0])}",
                BULLET,
            )
        )

    items = [
        KeepTogether(
            opening
        )
    ]

    for bullet in bullets[1:]:
        items.append(
            Paragraph(
                f"• {safe(bullet)}",
                BULLET,
            )
        )

    items.append(
        Spacer(
            1,
            4.5,
        )
    )

    return items

def selected_expertise_block(
    item: dict,
):
    title = safe(
        item["title"]
    )

    if item.get(
        "url"
    ):
        title = linked(
            item["title"],
            item["url"],
        )

    return KeepTogether(
        [
            Paragraph(
                title,
                SELECTED_TITLE,
            ),

            Paragraph(
                (
                    "• "
                    + safe(
                        item["body"]
                    )
                ),
                BULLET,
            ),

            Spacer(
                1,
                3,
            ),
        ]
    )


def education_block(
    item: dict,
):
    degree_line = (
        f"{safe(item['degree'])} "
        f"<font name='Arimo-Regular'>"
        f"{safe(item['date'])}"
        "</font>"
    )

    opening = [
        Paragraph(
            degree_line,
            EDUCATION_TITLE,
        ),

        Paragraph(
            (
                f"{safe(item['institution'])} | "
                f"{safe(item['location'])}"
            ),
            EDUCATION_META,
        ),
    ]

    items = [
        KeepTogether(
            opening
        )
    ]

    research = item.get(
        "research"
    )

    if research:
        research_text = safe(
            research["label"]
        )

        if research.get(
            "url"
        ):
            research_text = linked(
                research["label"],
                research["url"],
            )

        items.append(
            Paragraph(
                (
                    f"<b>{safe(item['research_label'])}:</b> "
                    f"<i>{research_text}</i>"
                ),
                EDUCATION_RESEARCH,
            )
        )

    advisors = item.get(
        "advisors",
        [],
    )

    if advisors:
        advisor_links = []

        for advisor in advisors:
            if advisor.get(
                "url"
            ):
                advisor_links.append(
                    linked(
                        advisor["label"],
                        advisor["url"],
                    )
                )
            else:
                advisor_links.append(
                    safe(
                        advisor["label"]
                    )
                )

        items.append(
            Paragraph(
                (
                    f"<b>{safe(item['advisor_label'])}:</b> "
                    + " · ".join(
                        advisor_links
                    )
                ),
                EDUCATION_META,
            )
        )

    if item.get(
        "award"
    ):
        items.append(
            Paragraph(
                (
                    "<i>"
                    f"Award: {safe(item['award'])}"
                    "</i>"
                ),
                EDUCATION_AWARD,
            )
        )

    items.append(
        Spacer(
            1,
            4,
        )
    )

    return items

def draw_footer(
    canvas,
    doc,
):
    canvas.saveState()

    page_number = (
        canvas.getPageNumber()
    )

    y = 18

    canvas.setFont(
        "Arimo-Regular",
        7,
    )

    canvas.setFillColor(
        FAINT
    )

    footer_items = [
        (
            "Website",
            LINKS["website"],
        ),

        (
            "LinkedIn",
            LINKS["linkedin"],
        ),

        (
            "YouTube",
            LINKS["youtube"],
        ),

        (
            "GitHub",
            LINKS["github"],
        ),

        (
            "ORCID",
            LINKS["orcid"],
        ),
    ]

    x = LEFT_MARGIN

    for index, (
        label,
        url,
    ) in enumerate(
        footer_items
    ):
        width = (
            pdfmetrics.stringWidth(
                label,
                "Arimo-Regular",
                7,
            )
        )

        canvas.drawString(
            x,
            y,
            label,
        )

        canvas.linkURL(
            url,
            (
                x,
                y - 1,
                x + width,
                y + 8,
            ),
            relative=0,
            thickness=0,
        )

        x += width + 5

        if (
            index <
            len(
                footer_items
            ) - 1
        ):
            canvas.drawString(
                x,
                y,
                "|",
            )

            x += 7

    page_text = (
        f"CV · {page_number}"
    )

    page_width = (
        pdfmetrics.stringWidth(
            page_text,
            "Arimo-Regular",
            7,
        )
    )

    canvas.drawString(
        PAGE_WIDTH
        - RIGHT_MARGIN
        - page_width,
        y,
        page_text,
    )

    canvas.restoreState()


# =========================================================
# DOCUMENT
# =========================================================

doc = BaseDocTemplate(
    str(
        OUTPUT_PATH
    ),
    pagesize=letter,
    leftMargin=LEFT_MARGIN,
    rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN,
    bottomMargin=BOTTOM_MARGIN,
    title=f"{PROFILE['name']} - Curriculum Vitae",
    author=PROFILE["name"],
    subject=CV_DATA["profile"]["headline"],
)


frame = Frame(
    LEFT_MARGIN,
    BOTTOM_MARGIN,
    CONTENT_WIDTH,
    PAGE_HEIGHT
    - TOP_MARGIN
    - BOTTOM_MARGIN,
    leftPadding=0,
    rightPadding=0,
    topPadding=0,
    bottomPadding=0,
    id="cv-frame",
)


page_template = PageTemplate(
    id="cv-template",
    frames=[
        frame,
    ],
    onPage=draw_footer,
)


doc.addPageTemplates(
    [
        page_template,
    ]
)


# =========================================================
# DOCUMENT CONTENT
# =========================================================

story = []


# ---------------------------------------------------------
# TOP IDENTITY
# ---------------------------------------------------------

story.append(
    Paragraph(
        safe(PROFILE["name"].upper()),
        NAME,
    )
)

story.append(
    Spacer(
        1,
        2.6,
    )
)

story.append(
    Paragraph(
        safe(
            CV_DATA["profile"]["headline"]
        ),
        HEADLINE,
    )
)

story.append(
    Paragraph(
        (
            safe(
                PROFILE["location"]
            )
            + " | "
            + linked(
                PROFILE_LINKS["email"]["label"],
                LINKS["email"],
            )
            + " | "
            + linked(
                "Website",
                LINKS["website"],
            )
            + " | "
            + linked(
                "LinkedIn",
                LINKS["linkedin"],
            )
            + " | "
            + linked(
                "GitHub",
                LINKS["github"],
            )
            + " | "
            + linked(
                "ORCID",
                LINKS["orcid"],
            )
        ),
        CONTACT,
    )
)

language_text = ", ".join(
    (
        f"{item['name']} "
        f"({item['proficiency']})"
    )
    for item in CV_DATA["languages"]
)

story.append(
    Paragraph(
        safe(
            language_text
        ),
        LANGUAGES,
    )
)


story.append(
    Spacer(
        1,
        4,
    )
)

story.append(
    HRFlowable(
        width="100%",
        thickness=0.55,
        color=HEADER_RULE,
        spaceBefore=0,
        spaceAfter=8,
        hAlign="LEFT",
    )
)

# ---------------------------------------------------------
# PROFESSIONAL SUMMARY
# ---------------------------------------------------------

story.extend(
    section(
        "Professional Summary"
    )
)

story.append(
    Paragraph(
        safe(
            PROFESSIONAL_SUMMARY
        ),
        BODY_TEXT,
    )
)


# ---------------------------------------------------------
# CORE EXPERTISE
# ---------------------------------------------------------

story.extend(
    section(
        "Core Professional Expertise"
    )
)

for label, content in (
    CORE_EXPERTISE
):
    story.append(
        Paragraph(
            (
                f"<b>{safe(label)}</b> "
                f"{safe(content)}"
            ),
            CORE_LINE,
        )
    )


# ---------------------------------------------------------
# PROFESSIONAL EXPERIENCE
# ---------------------------------------------------------

story.extend(
    section(
        "Professional Experience"
    )
)

for role in EXPERIENCE:
    story.extend(
        experience_block(
            role
        )
    )


# ---------------------------------------------------------
# SELECTED RESEARCH & PROFESSIONAL EXPERTISE
# ---------------------------------------------------------

story.extend(
    section(
        "Selected Research & Professional Expertise"
    )
)

for item in SELECTED_EXPERTISE:
    story.append(
        selected_expertise_block(
            item
        )
    )

# ---------------------------------------------------------
# EDUCATION
# ---------------------------------------------------------

if EDUCATION:
    first_education = education_block(
        EDUCATION[0]
    )

    education_opening = (
        section(
            "Education"
        )
        + [
            first_education[0]
        ]
    )

    story.append(
        KeepTogether(
            education_opening
        )
    )

    story.extend(
        first_education[1:]
    )

    for item in EDUCATION[1:]:
        story.extend(
            education_block(
                item
            )
        )


# ---------------------------------------------------------# SELECTED CERTIFICATIONS
# ---------------------------------------------------------

story.extend(
    section(
        "Selected Certifications and Professional Training"
    )
)

for (
    issuer,
    title,
    issued,
    url,
) in CERTIFICATIONS:
    story.append(
        Paragraph(
            (
                "• "
                f"<b>{safe(issuer)}</b>"
                " | "
                + linked(
                    title,
                    url,
                )
                + f" ({safe(issued)})"
            ),
            CERT,
        )
    )


# =========================================================
# BUILD
# =========================================================

doc.build(
    story
)


print()
print(
    "SUCCESS: Production CV generated."
)
print(
    f"Output: {OUTPUT_PATH}"
)
print(
    "Layout: US Letter / Arimo / natural pagination"
)
print()
