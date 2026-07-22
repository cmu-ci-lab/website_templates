# Website templates for CIRL

This repository provides templates for:
* personal websites under `personal` ([example](https://www.cs.cmu.edu/~igkioule/)),
* paper websites under `paper` ([example](https://imaging.cs.cmu.edu/volumetric_opaque_solids/)),
* course websites under `course` ([example](https://imaging.cs.cmu.edu/15-468/)),
* tutorial websites under `tutorial` ([example](https://imaging.cs.cmu.edu/pbr_cvpr2023/)).

The website templates are designed to provide a clean and consistent layout using minimal Javascript and validated semantic [HTML5](https://validator.w3.org/) and [CSS](https://jigsaw.w3.org/css-validator/) code. The templates make use of [Font Awesome Free](https://fontawesome.com/) for icons, and [TwentyTwenty](https://github.com/zurb/twentytwenty) and [model-viewer](https://modelviewer.dev/) for visualizations.

Even though these website templates are designed for the [Carnegie Mellon computational imaging](https://imaging.cs.cmu.edu/) lab, they may be useful to other academics and researchers. You are welcome to use them, but if you do please make sure to:
* replace details specific to the Carnegie Mellon computational imaging lab (for example, favicon) as appropriate,
* if possible, add an acknowledgment to this repository!

## Stylesheets

The base stylesheet lives once in `shared/style.css`, served at `/shared/style.css` and loaded by every template's `index.html` through a root-absolute `<link>`. Edit it in one place and all four pages update. Template-specific rules stay in that template's own `index_files/style.css` (only `paper` has one, for its visualizations), loaded after the shared sheet.

The Lato font used by the templates is self-hosted once under `shared/fonts/`, loaded via `@font-face` in `shared/style.css`. The body font family is set through the `--body-font` CSS variable in `:root`; to change fonts, add `@font-face` blocks and update that one variable.

Because the CSS, fonts, favicon, and icons are shared at `/shared/`, a template directory is **not** standalone: deploy the four templates as sibling folders alongside `shared/` under a single web root so that `/shared/…` resolves (all four lab sites sit under one Apache docroot).

## Icons

Icons come from [Font Awesome Free](https://fontawesome.com/) 7.3.1, self-hosted under `shared/fontawesome/` — there is no kit script and no third-party request, so the icons work on any domain and in local preview. Each `index.html` loads `fontawesome.min.css` (the icon-name map) plus the styles it actually uses, and preloads the corresponding WOFF2 files; Font Awesome sets `font-display: block`, so dropping a preload leaves the icons blank until the font arrives.

Use icons as `<i class="fa-solid fa-envelope fa-sm fa-fw" aria-hidden="true"></i>&nbsp;label`. Two constraints:
* only the **Free** set is available — the `duotone`, `light`, `thin`, and `sharp` styles and all Pro-only icon names are not. Check a candidate icon against the [free gallery](https://fontawesome.com/search?ic=free) before using it,
* `course` and `tutorial` deliberately do not load `brands.min.css` because they use no brand icons. If you add one (for example `fa-brands fa-github`), uncomment or add both its stylesheet `<link>` and its preload, as `personal` and `paper` do.

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
* the [Lato](https://www.latofonts.com/) font by Łukasz Dziedzic, under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL); the license text is included as `shared/fonts/OFL.txt`,
* [jQuery](https://jquery.com/), under the MIT license (notice preserved in `paper/index_files/jquery.min.js`),
* [TwentyTwenty](https://github.com/zurb/twentytwenty) by ZURB, under the ISC license; our heavily modified copy in `paper/index_files/jquery.twentytwenty.js` supports up to four images (license notice in the file),
* [model-viewer](https://modelviewer.dev/), under the Apache License 2.0 (notice preserved in `paper/index_files/model-viewer.min.js`),
* [Font Awesome Free](https://fontawesome.com/) 7.3.1, self-hosted in `shared/fontawesome/`: icons under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), fonts under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL), and code under the MIT license; the full license text is included as `shared/fontawesome/LICENSE.txt`. CC BY 4.0 requires that you keep this attribution if you reuse the templates.
