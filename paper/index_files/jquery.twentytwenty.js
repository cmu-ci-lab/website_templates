/*!
 * Based on TwentyTwenty (https://github.com/zurb/twentytwenty)
 * Copyright 2018 zurb
 * Modified by the Carnegie Mellon computational imaging lab to support
 * comparison of up to four images with a two-axis split.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
(function($) {

    $.fn.twentytwenty = function(options) {
        var options = $.extend({
            default_offset_pct_x: 0.5,
            default_offset_pct_y: 0.5,
        }, options);
        return this.each(function() {

            var sliderPctX = options.default_offset_pct_x;
            var sliderPctY = options.default_offset_pct_y;
            var container = $(this);

            var numImgs = container.children("img").length;
            var imgs = [container.children("img").eq(0),
                        container.children("img").eq(1),
                        container.children("img").eq(2),
                        container.children("img").eq(3)];

            var temp = 0;
            var referenceIndex = 0;
            for (var i = 0; i < numImgs; i++)
            {
                if (temp < imgs[i].get(0).naturalWidth)
                {
                    temp = imgs[i].get(0).naturalWidth;
                    referenceIndex = i;
                }
            }

            container.css("max-width", imgs[referenceIndex].get(0).naturalWidth);
            container.addClass("twentytwenty-compare-" + numImgs)

            for (var i = 0; i < numImgs; i++)
                imgs[i].addClass("twentytwenty-" + (i+1));

            container.append("<div class='twentytwenty-overlay'></div>");
            var overlay = container.find(".twentytwenty-overlay");


            for (var i = 0; i < numImgs; i++)
                overlay.append("<div class='twentytwenty-label-" + (i+1) + "'>" + imgs[i].attr('alt') + "</div>");

            var labels = [overlay.find(".twentytwenty-label-1"),
                          overlay.find(".twentytwenty-label-2"),
                          overlay.find(".twentytwenty-label-3"),
                          overlay.find(".twentytwenty-label-4")];

            for (var i = 0; i < numImgs; i++)
                overlay.append("<div class='twentytwenty-frame-" + (i+1) + "'></div>");

            var frame1 = overlay.find(".twentytwenty-frame-1");
            var frame2 = overlay.find(".twentytwenty-frame-2");
            var frame3 = overlay.find(".twentytwenty-frame-3");
            var frame4 = overlay.find(".twentytwenty-frame-4");

            var frames = [overlay.find(".twentytwenty-frame-1"),
                          overlay.find(".twentytwenty-frame-2"),
                          overlay.find(".twentytwenty-frame-3"),
                          overlay.find(".twentytwenty-frame-4")];

            // A knob at the split point makes the comparison discoverable on desktop.
            overlay.append("<div class='twentytwenty-handle'></div>");
            var handle = overlay.find(".twentytwenty-handle");
            

            var calcOffset = function(dimensionPctX, dimensionPctY) {
                var w = imgs[referenceIndex].width();
                var h = imgs[referenceIndex].height();
                return {
                    w: w + "px",
                    h: h + "px",
                    cw: (dimensionPctX * w) + "px",
                    ch: (dimensionPctY * h) + "px",
                    w2: w,
                    h2: h,
                    cw2: (dimensionPctX * w),
                    ch2: (dimensionPctY * h)
                };
            };

            var adjustContainer = function(offset) {
                overlay.css("width", offset.w);
                overlay.css("height", offset.h);
                if (numImgs == 2)
                {
                    imgs[0].css("clip-path", "inset(0px " + (offset.w2 - offset.cw2) + "px 0px 0px)");

                    labels[0].css({right: offset.w2 - offset.cw2});
                    labels[1].css({left: offset.cw2});
                    
                    frames[0].css({width: offset.cw2, height: offset.h2});
                    frames[1].css({width: offset.w2 - offset.cw2, height: offset.h2});
                }
                else if (numImgs == 3)
                {
                    imgs[0].css("clip-path", "inset(0px " + (offset.w2 - offset.cw2) + "px " + (offset.h2  - offset.ch2) + "px 0px)");
                    imgs[1].css("clip-path", "inset(0px 0px " + (offset.h2  - offset.ch2) + "px " + offset.cw + ")");
                    imgs[2].css("clip-path", "inset(" + offset.ch + " 0px 0px 0px)");

                    frames[0].css({width: offset.cw2, height: offset.ch2});
                    frames[1].css({width: offset.w2 - offset.cw2, height: offset.ch2});
                    frames[2].css({width: offset.w2, height: offset.h2 - offset.ch2});

                    labels[0].css({right: offset.w2 - offset.cw2, bottom: offset.h2 - offset.ch2});
                    labels[1].css({left: offset.cw2, bottom: offset.h2 - offset.ch2});

                    labels[2].css({top: offset.ch2});
                }
                else if (numImgs == 4)
                {
                    imgs[0].css("clip-path", "inset(0px " + (offset.w2 - offset.cw2) + "px " + (offset.h2  - offset.ch2) + "px 0px)");
                    imgs[1].css("clip-path", "inset(0px 0px " + (offset.h2  - offset.ch2) + "px " + offset.cw + ")");
                    imgs[2].css("clip-path", "inset(" + offset.ch + " " + (offset.w2 - offset.cw2) + "px 0px 0px");
                    imgs[3].css("clip-path", "inset(" + offset.ch + " 0px 0px 0px)");

                    frames[0].css({width: offset.cw2, height: offset.ch2});
                    frames[1].css({width: offset.w2 - offset.cw2, height: offset.ch2});
                    frames[2].css({width: offset.cw2, height: offset.h2 - offset.ch2});
                    frames[3].css({width: offset.w2 - offset.cw2, height: offset.h2 - offset.ch2});

                    labels[0].css({right: offset.w2 - offset.cw2, bottom: offset.h2 - offset.ch2});
                    labels[1].css({left: offset.cw2, bottom: offset.h2 - offset.ch2});

                    labels[2].css({right: offset.w2 - offset.cw2, top: offset.ch2});
                    labels[3].css({left: offset.cw2, top: offset.ch2});
                }

                handle.css({left: offset.cw, top: offset.ch});

                container.css("height", offset.h);
            };

            var adjustSlider = function(pctX, pctY) {
                var offset = calcOffset(pctX, pctY);

                adjustContainer(offset);
            }

            $(window).on("resize.twentytwenty", function(e) {

                for (var i = 0; i < numImgs; i++)
                {
                    if (i != referenceIndex)
                    {
                        imgs[i].css("width", imgs[referenceIndex].width());
                        imgs[i].css("height", imgs[referenceIndex].height());
                    }
                }
                adjustSlider(sliderPctX, sliderPctY);
            });

            // Move the split to a pointer position. Pointer Events unify mouse, touch, and pen.
            var setSplitFromPointer = function(oe) {
                sliderPctX = Math.max(0, Math.min(1, (oe.pageX - container.offset().left) / imgs[referenceIndex].width()));
                sliderPctY = Math.max(0, Math.min(1, (oe.pageY - container.offset().top) / imgs[referenceIndex].height()));
                adjustSlider(sliderPctX, sliderPctY);
            };

            var dragging = false;

            container.on("pointerdown", function(e) {
                var oe = e.originalEvent;
                dragging = true;
                // Keep receiving moves even if the finger or cursor leaves the container mid-drag.
                if (this.setPointerCapture)
                    this.setPointerCapture(oe.pointerId);
                setSplitFromPointer(oe);
            });

            container.on("pointermove", function(e) {
                var oe = e.originalEvent;
                // A mouse tracks on hover, as before; touch and pen track only while pressed.
                if (oe.pointerType === "mouse" || dragging)
                    setSplitFromPointer(oe);
            });

            container.on("pointerup pointercancel", function() {
                dragging = false;
            });

            // Keyboard support: arrow keys nudge the split by 5%, Home/End jump to the corners.
            container.attr("tabindex", 0);
            container.attr("aria-label", "Image comparison. Use the arrow keys to move the split between the images.");
            container.on("keydown", function(e) {
                var oe = e.originalEvent;
                var step = 0.05;
                var handled = true;
                switch (oe.key) {
                    case "ArrowLeft":  sliderPctX = Math.max(0, sliderPctX - step); break;
                    case "ArrowRight": sliderPctX = Math.min(1, sliderPctX + step); break;
                    case "ArrowUp":    sliderPctY = Math.max(0, sliderPctY - step); break;
                    case "ArrowDown":  sliderPctY = Math.min(1, sliderPctY + step); break;
                    case "Home":       sliderPctX = 0; sliderPctY = 0; break;
                    case "End":        sliderPctX = 1; sliderPctY = 1; break;
                    default: handled = false;
                }
                if (handled) {
                    e.preventDefault(); // don't let the arrow keys scroll the page too
                    adjustSlider(sliderPctX, sliderPctY);
                }
            });

            // Don't let the browser start an image drag while sliding.
            container.find("img").on("dragstart", function(event) {
                event.preventDefault();
            });

            $(window).trigger("resize.twentytwenty");
        });
    };

})(jQuery);