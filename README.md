# Website templates for CIRL

This repository provides templates for:
* personal websites under `personal` ([example](https://www.cs.cmu.edu/~igkioule/)),
* paper websites under `paper` ([example](https://imaging.cs.cmu.edu/volumetric_opaque_solids/)),
* course websites under `course` ([example](https://imaging.cs.cmu.edu/15-468/)),
* tutorial websites under `tutorial` ([example](https://imaging.cs.cmu.edu/pbr_cvpr2023/)).

The website templates are designed to provide a clean and consistent layout using minimal Javascript and validated semantic [HTML5](https://validator.w3.org/) and [CSS](https://jigsaw.w3.org/css-validator/) code. The templates make use of [Font Awesome](https://fontawesome.com/) for icons, and [TwentyTwenty](https://github.com/zurb/twentytwenty) and [model-viewer](https://modelviewer.dev/) for visualizations.

Even though these website templates are designed for the [Carnegie Mellon computational imaging](https://imaging.cs.cmu.edu/) lab, they may be useful to other academics and researchers. You are welcome to use them, but if you do please make sure to:
* replace details specific to the Carnegie Mellon computational imaging lab (for example, favicon) as appropriate,
* use your own Font Awesome kit,
* if possible, add an acknowledgment to this repository!

## Stylesheets

Each template ships its own self-contained `index_files/style.css`, split into two marked sections:
* a shared base section that must remain byte-identical across all four templates,
* a template-specific section (below the "Template-specific styles" marker) for rules used only by that template.

If you edit the base section in one template, apply the same change to the other three. You can check for drift by verifying that all four checksums below match:
```bash
for t in personal paper course tutorial; do sed -n '1,/Template-specific styles/p' $t/index_files/style.css | md5sum; done
```

The Lato font used by the templates is self-hosted, with WOFF2 files duplicated in each template under `index_files/fonts/`.

## Figures

Figures in the templates (for example, teasers) are from the example websites linked above. You should make sure to replace them with your own. To match the website width and font, your figures should have a width of 708 units (SVG user units) and use the Lato regular font with size 10.8pt. We recommend using SVG figures where possible.

To help you create your own figures, the folder `assets` contains:
* an Adobe Illustrator template you can use to create figures that are compatible with the website width and font, 
* original files for the logo of the Carnegie Mellon computational imaging lab (originally by [Yi Hua](https://hawaiii.github.io/)).

## Paper visualizations

The `paper` template includes optional interactive visualizations: image comparison sliders ([TwentyTwenty](https://github.com/zurb/twentytwenty)), zoomable image insets (ImageBox), and 3D model display ([model-viewer](https://modelviewer.dev/)). If your paper does not need them, remove all of the following from `paper/index.html`:
* the visualization-only lines in `<head>`: the `ImageBox.js`, `jquery.min.js`, and `jquery.twentytwenty.js` scripts, the `twentytwenty.css` stylesheet, the `model-viewer.min.js` script, and, in the inline script, the `imageBoxes` array and the `setup()` function (keep `copyText()`, which the citation copy button uses),
* the `onload="setup();"` attribute on the `<body>` tag — if you keep it after removing the scripts above, the page will throw a JavaScript error on load,
* the visualization `<section>` in the body, and its link in the header navigation.

You can then also delete the files only the visualizations use from `paper/index_files`: `ImageBox.js`, `jquery.min.js`, `jquery.twentytwenty.js`, `twentytwenty.css`, `model-viewer.min.js`, and the `bmvs` folder.

## Third-party components

The repository's [MIT license](LICENSE) covers the templates themselves. The templates additionally bundle or load the following third-party components, which remain under their own licenses:
* the [Lato](https://www.latofonts.com/) font by Łukasz Dziedzic, under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL); the license text is included as `index_files/fonts/OFL.txt` in each template,
* [jQuery](https://jquery.com/), under the MIT license (notice preserved in `paper/index_files/jquery.min.js`),
* [TwentyTwenty](https://github.com/zurb/twentytwenty) by ZURB, under the ISC license; our heavily modified copy in `paper/index_files/jquery.twentytwenty.js` supports up to four images (license notice in the file),
* [model-viewer](https://modelviewer.dev/), under the Apache License 2.0 (notice preserved in `paper/index_files/model-viewer.min.js`),
* [Font Awesome](https://fontawesome.com/) icons, loaded through a Font Awesome kit and subject to Font Awesome's own licensing; as noted above, our kit only works on lab domains, so you must substitute your own.
