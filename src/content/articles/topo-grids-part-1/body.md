*Progredimur, cum disciplina, agimus | We move forward, learning, we do.*

## Quick Summary

This article explores how to recreate the corner coordinates, measured grids, and graticules commonly found on historical topographic maps using ArcGIS Pro.

It focuses on Dynamic Text, coordinate formatting, minute padding, directional control, intermediate minute markers, and the small cartographic choices that give old topo maps their deliberate appearance.

## Introduction

This series began with looking at **bar scales** ([*see here*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/grids-and-graticules.html)), a small map element with a big job. Now, we step into another layer of historical cartography: [**grids and graticules**](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/grids-and-graticules.html). These *“lines of legacy”* silently frame every map’s accuracy, and today, we’ll look at how to get them in **ArcGIS Pro**.

If you’re aiming to recreate the *authentic feel of old topo maps* (or get closer to it) using modern cartographic software, grids and graticules are non-negotiable. Let’s dive into these waters. Ready? Perfect!

## Why Coordinates, Grids and Graticules Matter

Graticules and grids are more than decorative lines; they:

1. Provide a *universal reference system* ensuring spatial accuracy.

2. Enable *precise positioning and navigation*, critical for disciplines like surveying, engineering, and many others.

ArcGIS Pro offers [five types of grids](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/grids-and-graticules.html#:~:text=There%20are-,five%20types%20of%20grids,-that%20can%20be) that you can add to a map frame. We shall look at some of these in detail later.

## The Legacy Simplicity of Old Topo Maps

Old topo maps often favored a minimalist but effective style. Some of these bits include:

1. **Corner Coordinates** with degrees and minutes (no directions like N/S/E/W).

2. **Intermediate Minutes** marked between whole degrees.

3. Direction indicators and negative signs? Deliberately omitted.

![Historical topographic map layout showing corner coordinates, graticules, and intermediate minute markers.](./images/figure-01-historical-grid-layout.png)

*Figure 1. Typical grids and graticules layout in a historical topographic map.*

Measured grids are often the **10,000-meter** Universal Transverse Mercator (UTM) grid shown in blue. In the topo maps, they appear in two variants:

1. With **truncated 0000s** for a minimalist look. *Zeros are not allowed to clutter the party.*

2. Or, with the **0000s fully displayed** for explicit detailing, call it the “Keep everything on the table” approach.

![Historical measured grid labels with trailing zeros removed.](./images/figure-02-measured-grid-truncated.png)

*Figure 2. Measured grids with truncated 0000s.*

![Historical measured grid labels displaying all four trailing zeros.](./images/figure-03-measured-grid-full.png)

*Figure 3. Measured grids displaying full 0000s.*

For my map project, I chose to **retain the 0000s** *set in grey for a quiet nod to tradition*, while the main grid digits shine in blue, striking a balance between visual clarity and cartographic heritage. Blame it on the curious child in me.

It is worth noting that some reference maps also include grids showing measurements in feet, like the example on the left side of Figure 3 above. I have these in my map as well, but I won’t dive into them here. I’ll leave that to my curious ones to explore and master on their own to uncover new layers in your mapmaking journey.

> **Note**
>
> The measured grids shown in feet are part of the reference map, but they are outside the focus of this article.

## Corner Coordinates

Corner coordinates define the map’s four edges: **Upper Left, Upper Right, Lower Left, Lower Right**. In ArcGIS Pro, you add these via **Dynamic Text** found in the **Graphics and Text** group.

When added, ArcGIS Pro combines the **X** and **Y** into a single label, which is handy but not in line with the classic topo map style. These need to be changed to achieve the classic old style.

![Default ArcGIS Pro corner-coordinate labels with X and Y values combined.](./images/figure-04-default-combined-coordinates.png)

*Figure 4. Corner coordinates (default combined X and Y) in ArcGIS Pro.*

## Splitting X and Y Coordinates

To match the old style, split the X and Y into separate elements. This requires editing the Dynamic Text tags in the Element Pane (Text View).

![ArcGIS Pro Dynamic Text tag before separating X and Y coordinates.](./images/figure-05-dynamic-text-before.png)

*Figure 5. Dynamic Text tag before editing (combined X and Y).*

![ArcGIS Pro Dynamic Text tag configured to display the X coordinate separately.](./images/figure-06-dynamic-text-x.png)

*Figure 6. Dynamic Text tag after splitting the X coordinate.*

![ArcGIS Pro Dynamic Text tag configured to display the Y coordinate separately.](./images/figure-07-dynamic-text-y.png)

*Figure 7. Dynamic Text tag after splitting the Y coordinate.*

> **Tip**
>
> Split the X and Y coordinates before applying the detailed formatting. This avoids repeating the same formatting work later.

## Fixing Directional Clutter and Padding Minutes

Old topo maps avoided directional labels and negative signs. Apparently, even the old maps had strong opinions about staying anonymously positive. Here’s how you replicate that:

1. Disable directions with *showDirections="False"* but to others;

2. They eliminate negative signs by setting [*showDirections="None"*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/grid-label-tags.html#:~:text=showDirections,-Show%20the%20cardinal%20point) if it’s on the west.

> **Important**
>
> Review the result on every map-frame edge. A direction setting that works for one coordinate position may behave differently elsewhere.

## Minute Padding (A Small Detail That Matters)

Topo maps consistently padded single-digit minutes with a leading zero (e.g., “05” instead of “5”). Achieve this by using [*padMinutes="True"*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/grid-label-tags.html#:~:text=padMinutes,-Show%20two%20digits%20for%20all%20minute%20values).

*Still following? Great, because even though we’re in the weeds of grid minutiae, we haven’t lost our bearings yet!* Forward we move.

## Units Tag (The DDM and DMS Switcheroo)

Topo maps display coordinates in [*Decimal Degrees Minutes (ddm)*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/add-and-modify-dynamic-text.html#:~:text=ddm%20%7C%20Decimal%20Minutes), whereas ArcGIS Pro defaults to **Degrees Minutes Seconds (dms)**. This is adjusted with the **units="ddm"** tag.

> **Note**
>
> Confirm the coordinate convention used by the reference map before changing the units tag.

## Mind Your Placement (X is Not Y’s Cousin)

Once everything is well formatted, double-check that **X coordinates are on the horizontal edges** and **Y coordinates are on the vertical edges**. Swapping them is like wearing your left shoe on the right foot; you’ll still walk, but your map will limp.

![Correct placement of separated X and Y coordinate labels around a map frame.](./images/figure-08-correct-coordinate-placement.png)

*Figure 8. Correctly positioned X and Y coordinates in a map frame’s layout.*

## Graticules (Filling the Gaps Between Degrees)

Between every whole degree line, for example between *109°00′* and *110°00′*, old maps typically mark **15′, 30′, and 45′ intervals**, increasing from east to west. To replicate this in ArcGIS Pro:

1. Add a **new graticule grid** from the Map Frames group.

2. Format it to show **whole minutes only**.

3. Align intervals with your *reference map*. *After all, guessing is for trivia nights, not mapmaking.* Sure?

![Intermediate 15, 30, and 45 minute markers between whole-degree labels.](./images/figure-09-intermediate-minute-markers.png)

*Figure 9. Intermediate minute markers (marked in red) in between whole degrees in blue.*

Below is a visualization of what the dynamic tag looks like for the map that I am on.

![ArcGIS Pro Dynamic Text configuration used to display intermediate minute markers.](./images/figure-10-minute-marker-tag.png)

*Figure 10. A dynamic text tag showing the minute markers in ArcGIS Pro.*

Here, **two dynamic tags combine forces**:

1. [*dms.min*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/add-and-modify-dynamic-text.html#:~:text=dms.min,%27), which captures whole minutes (no direction).

2. [*dms.min.sym*](https://doc.esri.com/en/arcgis-pro/latest/help/layouts/add-and-modify-dynamic-text.html#:~:text=dms.min.sym,%27), which adds the minutes symbol (′).

Two tags, one mission. Once again, proving that **cartography is a team sport**.

## Wrapping Up Part I

From bar scales to corner coordinates, and now to the intricate web of graticules, we’ve seen how every line on a topo map is crafted with purpose. Recreating these elements in ArcGIS Pro isn’t just a technical exercise; it’s a return to cartographic craftsmanship where small tweaks hold enormous impact. We’ve handled the corner coordinates and graticule minutiae, but we’re not home yet.

In [***Part II***](/articles/topo-grids-part-2), we’ll roll up our sleeves and tackle the **Measured Grids**, the powerhouse gridlines that structure the projected coordinate system of your map. From crafting complex grid labels to perfecting tick marks and offsets, we’ll look at how to faithfully recreate the subtle but powerful grid aesthetics seen in historical topo maps.

Thank you!
