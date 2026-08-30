from __future__ import annotations

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

LOCAL_FONT_DIR = (
    Path.home()
    / "AppData"
    / "Local"
    / "Microsoft"
    / "Windows"
    / "Fonts"
)

ARIMO_REGULAR = (
    LOCAL_FONT_DIR
    / "Arimo-VariableFont_wght.ttf"
)

ARIMO_BOLD = (
    LOCAL_FONT_DIR
    / "Arimo-Bold.ttf"
)

ARIMO_ITALIC = (
    LOCAL_FONT_DIR
    / "Arimo-Italic-VariableFont_wght.ttf"
)

ARIMO_BOLD_ITALIC = (
    LOCAL_FONT_DIR
    / "Arimo-BoldItalic.ttf"
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
    str(path)
    for path in required_fonts.values()
    if not path.exists()
]


if missing_fonts:
    raise SystemExit(
        "STOPPED: Required Arimo font files "
        "were not found:\n\n"
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

LINKS = {
    "email":
        "mailto:kamusaley@gmail.com",

    "website":
        "https://figmulberry.github.io/",

    "linkedin":
        "https://www.linkedin.com/in/mkthiongo/",

    "github":
        "https://github.com/figmulberry",

    "youtube":
        "https://www.youtube.com/@thekalabashmosaics",

    "instagram":
        "https://www.instagram.com/musathiongo",

    "orcid":
        "https://orcid.org/0009-0005-4301-9507",
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
# CV CONTENT
# =========================================================

PROFESSIONAL_SUMMARY = (
    "Geospatial professional with over nine years of experience "
    "across GIS analysis, spatial data management, enterprise GIS, "
    "cartography, remote sensing, data quality, technical documentation, "
    "research, training, data analytics, and AI training and evaluation. "
    "Experienced in supporting global ArcGIS users, designing and validating "
    "spatial data infrastructure, producing decision-support outputs, "
    "conducting applied geospatial research, training field and technical "
    "teams, and delivering complex work independently across distributed "
    "environments. Combines strong geospatial domain expertise with "
    "quality assurance, reproducible workflow design, analytical problem "
    "solving, and structured evaluation of technical and AI-generated outputs."
)


CORE_EXPERTISE = [
    (
        "GIS Platforms:",
        "ArcGIS Pro 3.x · ArcGIS Enterprise · ArcGIS Online · "
        "ArcMap · QGIS · ArcGIS Dashboards · ArcGIS Experience Builder"
    ),

    (
        "Spatial Data Quality:",
        "attribute validation · geometry and feature checks · coordinate "
        "systems · projections · spatial-reference troubleshooting · "
        "completeness and consistency review · duplicate and anomaly "
        "detection · issue correction"
    ),

    (
        "Geodatabases & Data Management:",
        "ArcGIS geodatabases · enterprise geodatabase architecture · "
        "PostgreSQL/PostGIS · SQL · data loading and interoperability · "
        "metadata standards · version control"
    ),

    (
        "Mapping & Spatial Analysis:",
        "vector and raster analysis · geoprocessing · land-use and "
        "land-cover analysis · GPS field mapping · remote sensing · "
        "map editing · thematic cartography · layouts and dashboards"
    ),

    (
        "Earth Observation & Environmental Analysis:",
        "Google Earth Engine · Sentinel-2 · Copernicus · OpenEO · WEkEO · "
        "ClimateSERV · change detection · environmental monitoring"
    ),

    (
        "Programming, Analytics & Automation:",
        "Python · ArcPy · GeoPandas · Rasterio · R · SQL · Power BI · "
        "batch scripting · reproducible GIS workflows"
    ),

    (
        "AI Training & Evaluation:",
        "rubric-based evaluation · output quality assessment · "
        "annotation and labeling QA · consistency review · structured "
        "feedback · prompt and workflow development · technical validation"
    ),

    (
        "Technical Delivery & Communication:",
        "technical documentation · knowledge-base writing · workflow design · "
        "training · stakeholder communication · remote collaboration · "
        "cross-functional delivery"
    ),
]


EXPERIENCE = [
    {
        "title":
            "QGIS Expert and AI Trainer | AI Training & Evaluation Contributor",

        "organization":
            "Micro1 Inc.",

        "location":
            "Remote",

        "dates":
            "April 2026 - July 2026",

        "bullets": [
            (
                "Led end-to-end GIS projects covering spatial data acquisition, "
                "cleaning, validation, coordinate systems, geoprocessing, "
                "symbology, cartographic layout production, and final-output quality."
            ),

            (
                "Reviewed source datasets and geospatial outputs against technical "
                "requirements, identifying attribute, geometry, CRS, classification, "
                "completeness, and consistency issues and documenting corrective actions."
            ),

            (
                "Validated maps and datasets through source-to-output reconciliation, "
                "feature and extent checks, coordinate-system verification, output "
                "inspection, and reproducible quality-assurance procedures."
            ),

            (
                "Created workflow guides, QA checklists, reviewer notes, prompts, "
                "evaluation standards, and troubleshooting records that made technical "
                "decisions traceable and repeatable."
            ),

            (
                "Evaluated AI-generated outputs using detailed rubrics and quality "
                "standards, providing structured feedback across GIS and Microsoft 365 "
                "workflows to support consistency and model improvement."
            ),
        ],
    },

    {
        "title":
            "GIS Specialist - THRIVE 2030 Kenya Project",

        "organization":
            "World Vision International",

        "location":
            "Nairobi, Kenya",

        "dates":
            "June 2024 - January 2026",

        "bullets": [
            (
                "Worked closely with the Design, Monitoring, Evaluation, "
                "Accountability and Learning (DMEAL) team on programme monitoring, "
                "donor reporting, national planning, integrated data infrastructure, "
                "and evidence-based decision support."
            ),

            (
                "Designed and managed GIS infrastructure combining household, "
                "environmental, land-use, and spatial datasets for 300,000+ households, "
                "applying completeness, consistency, geolocation, metadata, "
                "version-control, and change-tracking checks."
            ),

            (
                "Validated GPS and field records, investigated location and attribute "
                "inconsistencies, and produced corrected spatial datasets, maps, "
                "dashboards, and analytical outputs for programme targeting and "
                "strategic planning."
            ),

            (
                "Trained 70+ field staff and developed step-by-step materials and "
                "troubleshooting guidance to improve field data collection, "
                "documentation, validation, and geolocation accuracy."
            ),
        ],
    },

    {
        "title":
            "Urban Planner and GIS Analyst",

        "organization":
            "United Nations Human Settlements Programme (UN-Habitat)",

        "location":
            "Nairobi, Kenya",

        "dates":
            "May 2023 - November 2023",

        "bullets": [
            (
                "Reviewed, integrated, and validated multi-source topographic, "
                "land-cover, socioeconomic, road, boundary, and coastal-planning "
                "datasets, applying metadata, classification, and quality standards."
            ),

            (
                "Developed a Spatial Data Hub and ArcGIS Dashboard for stakeholder "
                "engagement, data sharing, programme reporting, and evidence-based planning."
            ),

            (
                "Produced maps, spatial outputs, workflow documentation, and technical "
                "briefs for cross-functional urban, coastal, and infrastructure-planning teams."
            ),
        ],
    },

    {
        "title":
            "GIS Analyst",

        "organization":
            "Environmental Systems Research Institute (Esri)",

        "location":
            "Redlands, CA, USA",

        "dates":
            "February 2020 - February 2023",

        "bullets": [
            (
                "Supported global users of ArcGIS Pro and ArcGIS Enterprise across "
                "infrastructure, land-management, environmental-monitoring, and related "
                "sectors, building deep expertise in enterprise GIS and spatial-data quality."
            ),

            (
                "Reviewed technical cases, user-provided datasets, geodatabases, "
                "diagnostic information, and workflow descriptions; reproduced issues, "
                "isolated root causes, validated outputs, and communicated precise resolutions."
            ),

            (
                "Diagnosed and resolved spatial-reference conflicts, attribute "
                "inconsistencies, schema problems, data-integrity errors, and enterprise "
                "geodatabase workflow issues affecting production GIS environments."
            ),

            (
                "Documented defects, reproduction steps, severity, corrective actions, "
                "and validation evidence for product and engineering teams."
            ),

            (
                "Authored technical guides and knowledge-base articles and worked "
                "remotely across time zones with consistent independent delivery and "
                "cross-functional collaboration."
            ),
        ],
    },

    {
        "title":
            "Spatial Data Analyst",

        "organization":
            "REGID Carbon Limited",

        "location":
            "Nairobi, Kenya",

        "dates":
            "March 2023 - May 2023",

        "bullets": [
            (
                "Analyzed, classified, and validated georeferenced data and "
                "satellite-derived outputs for ecosystem-restoration and "
                "carbon-accounting projects across Kenya, Zimbabwe, and Senegal, "
                "maintaining accuracy, traceability, and documentation standards."
            ),

            (
                "Applied Earth Observation and change-detection techniques to assess "
                "deforestation, land-use transitions, and environmental change."
            ),
        ],
    },
]


SELECTED_EXPERTISE = [
    {
        "title":
            "Spatial Strategies for Peace",

        "body":
            (
                "Applied spatial analysis to armed-group activity, cross-border "
                "movement, and displacement patterns in urban and peri-urban areas "
                "of Eastern Democratic Republic of the Congo through research with "
                "the Harvard Humanitarian Initiative."
            ),
    },

    {
        "title":
            "Geospatial Research & Applied Remote Sensing",

        "body":
            (
                "Research experience spans NOAA ROV dive-track modelling, "
                "Fall Armyworm spread mapping, land-use change monitoring, "
                "and satellite-based flood classification with ArcGIS Pro and Python."
            ),

        "url":
            "https://github.com/figmulberry/classifying-flood-imagery",
    },

    {
        "title":
            "AI Training, Evaluation & Quality Assurance",

        "body":
            (
                "Experience evaluating AI-generated outputs against detailed rubrics "
                "and technical standards, producing structured feedback, documenting "
                "quality issues, developing prompts and workflows, and supporting "
                "consistent model-training and evaluation processes."
            ),
    },
]


EDUCATION = [
    {
        "degree":
            "MSc, Geographic Information Science (GIS) and Cartography",

        "date":
            "December 2019",

        "institution":
            "University of Redlands",

        "location":
            "Redlands, CA, USA",

        "research":
            (
                "Spatial Representation of NOAA's Remotely Operated "
                "Vehicles (ROVs) Dive Tracks"
            ),

        "award":
            "Jack Dangermond GIS Scholarship",
    },

    {
        "degree":
            "Bachelor of Environmental Planning and Management",

        "date":
            "December 2018",

        "institution":
            "Kenyatta University",

        "location":
            "Nairobi, Kenya",

        "research":
            (
                "Mapping the 2017 spreading pattern of Fall Armyworm "
                "(Spodoptera frugiperda) and its implications on maize "
                "in Molo, Nakuru County"
            ),

        "award":
            "Esri 2018 GIS Young Scholar Award",
    },
]


CERTIFICATIONS = [
    (
        "Esri",
        "ArcGIS Pro Associate 2101",
        "June 2022",
        (
            "https://www.credly.com/badges/"
            "9c49ad3f-a230-4e66-9fe5-17792f023940"
            "?source=linked_in_profile"
        ),
    ),

    (
        "Anthropic",
        "Claude Code 101",
        "August 2026",
        "https://verify.skilljar.com/c/kxnfcww9ygr7",
    ),

    (
        "SurveyCTO Academy",
        "Foundations of SurveyCTO",
        "April 2026",
        "https://mycourse.app/v1V4tiESwCoxPX3mp",
    ),

    (
        "FAO",
        "Global Forest Resources Assessment 2025",
        "March 2026",
        (
            "https://elearning.fao.org/admin/tool/certificate/"
            "index.php?code=9261867005MT"
        ),
    ),

    (
        "McKinsey & Company",
        "McKinsey.org Forward Program",
        "December 2025",
        (
            "https://www.credly.com/badges/"
            "6e9453e8-5125-4f8a-a6ac-071dc0e359a3/"
            "linked_in_profile"
        ),
    ),

    (
        "The World Bank Group",
        "Documenting Development Data Using Metadata Standards",
        "December 2025",
        "https://mycourse.app/fyYRWRbCCilGgYYwn",
    ),

    (
        "Cisco",
        "Introduction to Modern AI",
        "August 2025",
        (
            "https://www.credly.com/badges/"
            "cf35c4e9-47ab-499b-8c8f-e74e0b015d8b/"
            "linked_in_profile"
        ),
    ),

    (
        "Google",
        "Foundations of Project Management",
        "December 2022",
        (
            "https://www.coursera.org/account/"
            "accomplishments/records/VCXS3JJT4QSS"
        ),
    ),
]


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
    items = [
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

    for bullet in role[
        "bullets"
    ]:
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

    return KeepTogether(
        items
    )


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

    return KeepTogether(
        [
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

            Paragraph(
                (
                    "<b>Research:</b> "
                    f"<i>{safe(item['research'])}</i>"
                ),
                EDUCATION_RESEARCH,
            ),

            Paragraph(
                (
                    "<i>"
                    f"Award: {safe(item['award'])}"
                    "</i>"
                ),
                EDUCATION_AWARD,
            ),

            Spacer(
                1,
                4,
            ),
        ]
    )


# =========================================================
# FOOTER
# =========================================================

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
    title="Moses Thiong'o - Curriculum Vitae",
    author="Moses Thiong'o",
    subject=(
        "Geospatial Intelligence, GIS & Spatial Data, "
        "Data Analytics, GeoAI, and AI Training & Evaluation"
    ),
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
        "MOSES THIONG'O",
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
        (
            "Geospatial Intelligence | GIS &amp; Spatial Data | "
            "Data Analytics | GeoAI | AI Training &amp; Evaluation"
        ),
        HEADLINE,
    )
)

story.append(
    Paragraph(
        (
            "Nairobi, Kenya"
            " | "
            + linked(
                "kamusaley@gmail.com",
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

story.append(
    Paragraph(
        (
            "English (Fluent), "
            "Swahili (Fluent), "
            "Gikuyu (Native)"
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
        "Core GIS, Data & AI Expertise"
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


# First role
story.append(
    experience_block(
        EXPERIENCE[0]
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

for item in (
    SELECTED_EXPERTISE
):
    story.append(
        selected_expertise_block(
            item
        )
    )


# Continue professional experience in natural document flow.
for role in (
    EXPERIENCE[1:]
):
    story.append(
        experience_block(
            role
        )
    )


# ---------------------------------------------------------
# EDUCATION
# ---------------------------------------------------------

story.extend(
    section(
        "Education"
    )
)

for item in EDUCATION:
    story.append(
        education_block(
            item
        )
    )


# ---------------------------------------------------------
# SELECTED CERTIFICATIONS
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
