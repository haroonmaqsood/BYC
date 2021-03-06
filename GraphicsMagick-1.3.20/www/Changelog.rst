2014-08-16  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - NEWS.txt: Update for 1.3.20 release.

  - www/index.rst: Update for 1.3.20 release.

  - version.sh: Update library versioning for next release.

2014-08-12  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - png: Updated libpng to 1.6.12 release.

  - zlib: Updated zlib to 1.2.8 release.

2014-08-09  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - NEWS.txt: Updated NEWS file to document changes since previous
    release.

2014-08-09  Jaroslav Fojtik  <JaFojtik@seznam.cz>

        \* coders/webp.c webp cannot be compiled when HasWEBP is not set.

2014-08-08  Glenn Randers-Pehrson  <glennrp@simple.dallas.tx.us>

  - coders/png.c: Eliminated palette and depth optimization (see
    https://sourceforge.net/p/graphicsmagick/feature-requests/35/).

2014-08-06  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - dcraw/dcraw.c: Fix dcraw build for x64 target when only WIN64 is
    defined (by also defining WIN32).

  - VisualMagick/configure/configure.cpp (write\_file): Fix problem
    with x64 project naming which caused object file disambiguation
    not to work for x64 target. Make line terminations consistent.

2014-08-03  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - VisualMagick: VisualMagick fixes by Dirk Lemstra to improve
    configure program so that it is possible to select QuantumDepth,
    OpenMP, and 64-bit build via configure dialog boxes as well as
    options on the command line.  Also automatically detects and deals
    with similarly named files in subdirectories so that WebP support
    can now build successfully.  Resolves SF patches 31, 33, 35, 37,
    and 38.

2014-07-27  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/nt\_base.c (NTResourceToBlob): Support loading mgk files
    as Windows resource from library if MagickLibName is defined.
    Patch contributed by Dirk Lemstra via SF patch #32.
    (NTGhostscriptDLL): For Microsoft Windows, add support for a
    MAGICK\_GHOSTSCRIPT\_PATH environment variable which specifies the
    path to Ghostscript.  If this environment variable is defined,
    then the Windows registry is not used to find Ghostscript.  Patch
    contributed by Dirk Lemstra via SF patch #39.

  - magick/log.c: Added SetLogMethod() to allow an
    application/library to specify a function to be called for
    logging.  Patch contributed by Dirk Lemstra.

2014-07-20  Glenn Randers-Pehrson  <glennrp@simple.dallas.tx.us>

  - coders/bmp.c: "opacity" read from a BMP3 is actually "alpha",
    so store q->opacity=MaxRGB-opacity instead of q->opacity=opacity.
    Reference: Bug tracker [bugs:#271] Blank result for BMP resize.

2014-07-20  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - webp, VisualMagick/webp: Integrate webp 0.4.0 into windows
    build.  May require manual renaming of output object files in
    project files to build webp until VisualMagick configure is
    improved!

2014-07-19  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/composite.c: fmin() and fmax() are defined by C'99 and
    not available everywhere, so add and use MagickFmin() and
    MagickFmax() to improve portability.

2014-07-11  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - Magick++/lib/Magick++/Image.h (Magick): Fix complilation errors
    caused by continued raw use of \_\_attribute\_\_.

2014-06-30  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/composite.c: Fixes by Brendan Lane for color channel
    overflows in modified/new quantum operators.  Fixes test suite
    results for Q32 build and makes LinearBurn and LinearDodge work
    correctly at all.

  - wand/pixel\_wand.c (PixelSetMagenta): Fix documentation.
    Resolves SourceForge bug #273 'Green Magenta' typo in docs.

2014-06-28  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/composite.c: Composition improvements and additions
    contributed by Brendan Lane via SourceForge patch #34 "Most of the
    missing Photoshop separable compositing operations"
    (https://sourceforge.net/p/graphicsmagick/patches/34/).  These
    composition operators were modified to include alpha in their
    computations: Difference, Darken, Lighten, HardLight, and these
    operators were added Overlay, Exclusion, ColorBurn, ColorDodge,
    SoftLight, LinearBurn, LinearDodge, LinearLight, VividLight,
    PinLight, HardMix.

2014-06-22  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/composite.c (ScreenCompositePixels): Implementation of
    Screen composite contributed by Brendan Lane.  SourceForge patch
    #30 "Missing Screen composite operation".

  - wand/magick\_compat.c: Re-worked Wand library implementation to
    depend directly on GraphicsMagick library functionality rather
    than using ImageMagick shim code from magick\_compat.c and
    magick\_compat.h. The magick\_compat.c source module becomes "dead
    code", which remains only to support the existing ABI, and will be
    deleted at the next major ABI break point.

  - magick/utility.c (MagickFormatString): New private function to
    format a string into a buffer with a specified size.  Same as
    previously existing FormatString() except requires a length
    argument.

2014-06-15  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - wand/magick\_compat.h: Use MAGICK\_ATTRIBUTE definition from
    magick/common.h.

  - magick/common.h (MAGICK\_ATTRIBUTE): Don't undefine \_\_attribute\_\_
    since this may be used by system or compiler headers.  Define
    private macro instead.  Resolves SourceForge bug #270 "Compile
    error with g++ -std=c++11".

2014-06-06  Glenn Randers-Pehrson  <glennrp@simple.dallas.tx.us>

  - coders/png.c (ReadOnePNGImage): Free png\_pixels and
    quantum\_scanline before error return.  Use "png\_error()"
    instead of "ThrowException2()" for errors occuring while
    decoding a PNG so proper cleanup will happen.

2014-06-03  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/tiff.c (ReadTIFFImage): Make sure that libtiff warnings
    are promoted to errors for critical tags.

2014-06-02  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/tiff.c (ReadTIFFImage): Be quite a lot more draconian
    when retrieving the baseline standard TIFF tags we need in order
    to avoid consuming uninitalized data later.  An error with these
    tags will result in failure to read the image file.

2014-05-21  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/operator.c: Decided that ThresholdBlackNegateQuantumOp
    and ThresholdWhiteNegateQuantumOp should set the result to white
    or black respectively rather than being based on subtraction.

2014-05-18  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - Makefile.am (AUTOMAKE\_OPTIONS): Be ultra-pedantic with CPPFLAGS
    and include paths in order to assure that only required
    directories are supplied, and to avoid accidential collision with
    system header files.

2014-05-17  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/operator.h ("C"): New quantum operators
    ThresholdBlackNegateQuantumOp and ThresholdWhiteNegateQuantumOp.
    These correspond to -operator "Threshold-Black-Negate" and
    "Threshold-White-Negate".

2014-05-11  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/composite.c (MultiplyCompositePixels): Multiply
    composition now uses SVG interpretation of how alpha should be
    handled.  No longer does a simple multiply of alpha channel.
    Behavior change.  Patch contributed by Sara Shafaei.

  - coders/msl.c (ProcessMSLScript): Deal with case where
    image\_info->attributes is NULL.

2014-04-29  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/utility.c (TranslateTextEx): Support additional format
    specifiers 'g', 'A', 'C', 'D', 'G', 'H', 'M', 'O', 'P', 'Q', 'T',
    'U', 'W', 'X', and '@'.
    (GetMagickGeometry): Support '>' and '<' qualifiers with '@'
    qualifier to specify if image should be resized if larger or
    lesser than given area specification.  Resolves SourceForge bug
    #216 ">" wont take effect when use @ to specify the maximum area.

  - magick/transform.c (GetImageMosaicDimensions): Move mosaic
    dimensions code to a static function for possible future re-use.

2014-04-23  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/gradient.c (GradientImage): Update image is\_grayscale and
    is\_monochrome flags based on gradient color properties.

2014-04-20  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/utility.c (GetMagickGeometry): Deal with resize geometry
    missing width or height (e.g. '640x' or 'x480') by substituting
    the missing value with one which preserves the image aspect ratio.
    This has been documented to be supported since almost the dawn of
    GraphicsMagick but was not actually supported until now.

2014-04-19  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - doc/options.imdoc: Document WebP encoder options.

  - coders/webp.c (WriteWEBPImage): Support all of the WebP encoder
    options via -define arguments.  Most of this work is contributed
    by Roman Hiestand.

  - configure.ac: User-provided LIBS should be prepended to LIBS
    that configure script produces so that user option takes
    precedence.

2014-04-12  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - PerlMagick/Magick.xs: Added support for HardLight composition
    operator.

  - www/perl.rst: Update PerlMagick documentation, including the
    composition operators.

  - coders/xcf.c (GIMPBlendModeToCompositeOperator): Use new
    HardLight composition operator to support XCF GIMP\_HARDLIGHT\_MODE
    blend mode.  Contributed by Sara Shafaei.

  - coders/psd.c (CompositeOperatorToPSDBlendMode): Use new
    HardLight composition operator to support PSD "hLit" blend mode.
    Contributed by Sara Shafaei.

  - wand/magick\_wand.c (MagickOperatorImageChannel): New function to
    apply an operator to an image channel.  Contributed by Sara
    Shafaei.

  - magick/composite.c (HardLightCompositePixels): New HardLight
    composition operator.  Contributed by Sara Shafaei.

2014-04-09  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/command.c (BenchmarkImageCommand): Add a CSV title line
    and quoting to benchmark -rawcsv output.

2014-04-05  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/webp.c: Add progress indication support to WebP writer.

  - magick/command.c (VersionCommand): WebP support is included in
    -version output.

  - coders/webp.c: WebP coder identifies library version and header
    ABI versions. Improve WebP error reporting.

2014-04-02  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/tiff.c (WriteTIFFImage): Allow specifying the TIFF image
    software tag.  In the special case that the string length is zero
    (e.g. -set software '') then the tag is skipped entirely.  This is
    to support SourceForge feature request #37 "Option to prevent
    addition of Exif Software tag" opened by Jean-Louis Grall.  Please
    note that this tag is not an EXIF tag.

  - magick/command.c: composite, convert, display, mogrify, and
    import now support +set to remove an existing image attribute.

2014-03-16  Glenn Randers-Pehrson  <glennrp@simple.dallas.tx.us>

  - coders/png.c: Don't block threads when PNG\_SETJMP\_SUPPORTED is
    not enabled.

  - coders/png.c: Changed prefix of macros defined in coders/png.c
    from PNG\_ to GMPNG\_.  PNG\_ is reserved for macros defined by
    libpng.

2014-03-16  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/blob.c: Don't use setvbuf() to set stdio block size if
    filesystem block size is zero (e.g. MAGICK\_IOBUF\_SIZE=0)

2014-03-12  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - tests/{rwblob.tap, rwfile.tap}: Added tests for WEBP.

  - tests/{rwblob.c, rwfile.c}: Add lossy hint for WEBP.

  - coders/webp.c (WriteWEBPImage): Fix inverted return status.
    Added a tiny bit of logging.

2014-03-09  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - ttf: Updated FreeType to release 2.5.3 of March 6, 2014.
    Provides security fixes for CVE-2014-2240.

  - jpeg: Update to libjpeg 9a of 19-Jan-2014.

  - png: Update to Libpng 1.6.10 - March 6, 2014.

2014-03-06  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/nt\_base.c (NTResourceToBlob): According to Microsoft
    Report article 193678 (http://support.microsoft.com/kb/193678),
    FreeResource() is not needed in WIN32 and performs no useful
    function.  Remove use of it.  Also remove use of UnlockResource()
    which is similarly unuseful for WIN32.

  - configure.ac (MAGICK\_LIBRARY\_REVISION): Test for Windows
    \_aligned\_malloc() is not reliable.  Use Windows CRT version to
    decide if it is available.

2014-03-05  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/studio.h: Make sure that Windows \_aligned\_malloc() is not
    used under MinGW unless the CRT version allows it.

2014-02-26  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/pixel\_cache.c (InterpolateViewColor): Applied patch by
    Troy Patteson plus fixes to ignore opacity channel if image matte
    is false.  Replaces most of the code rewritten on 2014-02-16 and
    which produced a faint darkened border.  The results look stellar
    now.

2014-02-24  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/shear.c: Applied patch by Troy Patteson to improve
    non-integral rotation by around 40% by minimizing added image
    borders.  This may cause small differences in results for some
    images.

  - reference/filter/Rotate10.miff: Update rotate 10 degrees
    reference image so that PerlMagick test passes.

  - magick/shear.c: Applied patch by Troy Patteson to fix
    SourceForge issue #260 "Rotation exhibits clipping/shearing errors
    for short wide images at some angles".

2014-02-22  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - doc/options.imdoc: Fix documentation to note that 'unspecified
    alpha' is the GraphicsMagick default when writing TIFF rather than
    'associated alpha'.  Much thanks to Mats Peterson for alerting us
    of this error.

2014-02-16  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/pixel\_cache.c (InterpolateViewColor): Added a hack so that
    affine transformations and displace composite do not have
    background colored fringing on the transferred image edges when
    the background is completely transparent.  Fringing problem was
    caused by one or more of the line ends being a transparent pixel
    outside of the bounds of the original image content.  May not be
    the final solution.

2014-02-14  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/semaphore.c (AcquireSemaphoreInfo): Document that this
    function was deprecated.
    (LiberateSemaphoreInfo): Document that this function was
    deprecated.

2014-02-11  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/psd.c (RegisterPSDImage): Set PSD to UnstableCoderClass
    since its implementation is currently rather marginal.  It may
    even be that this coder deserves to be marked with the new
    BrokenCoderClass.  We are still looking for a volunteer to iron
    out the wrinkles in the PSD reader.

  - magick/magick.h (CoderClass): Added BrokenCoderClass to mark
    coders which often malfunction or are not very useful in their
    current condition.  Sometimes there is still hope that problems
    will be resolved and so the source file is not outright deleted.
    This setting allows us to mark and use coders which might
    malfunction by defining MAGICK\_CODER\_STABILITY=BROKEN in the
    environment while not causing danger for normal use.

2014-02-09  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - wand/magick\_wand.c: Documentation improvements for
    MagickSetInterlaceScheme() and MagickSetImageInterlaceScheme().
    Resolves SourceForge bug #262 "setImageInterlaceScheme doesn't
    make image progressive".

2014-02-06  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/{ps.c, ps2.c, ps3.c, pdf.c}: Only use resolution from
    image or -density if units was properly specified.  Without units,
    resolution is worthless.

  - coders/ps3.c (WritePS3Image): Use image resolution similar to PDF
    changes.

  - coders/ps2.c (WritePS2Image): Use image resolution similar to PDF
    changes.

  - coders/ps.c (WritePSImage): Use image resolution similar to PDF
    changes.

  - coders/pdf.c (WritePDFImage): Use resolution from image if it
    appears to be valid.  Resolves SourceForge issue #261 "PNG Pixel
    Density Not Preserved Converting to PDF".

  - magick/enum\_strings.c (StringToResolutionType): New function to
    convert ResolutionType to C string.
    (ResolutionTypeToString): New function to convert from C string to
    ResolutionType.

2014-02-01  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - wand/magick\_wand.c (MagickGetImageGeometry): New function to get
    the image geometry string.  This function and the three others in
    this change set are contributed by Sara Shafaei.
    (MagickGetImageMatte): New function to read the image matte
    (opacity) channel enable flag.
    (MagickSetImageGeometry): New function to set the image geometry
    string.
    (MagickSetImageMatte): New function to set the image matte
    (opacity) channel enable flag.

2014-01-31  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - wand/magick\_wand.c (MagickDrawImage): Remove development debug
    fprintf which causes each drawing primitive to be printed to
    stderr.

2014-01-21  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - coders/pnm.c (ReadPNMImage): Fix scaling of alpha in sub-ranged
    pixels.  Addresses SourceForge issue #237 "Incorrect MAXVAL
    scaling when reading PAM images", which was not fully fixed in by
    the previous attempt.

2014-01-19  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/tsd.c: Implement TSD for "pure" OpenMP mode without
    relying on POSIX or WIN32 TSD APIs.

  - magick/semaphore.c: Implement OpenMP-based locking so that code
    can compile in a "pure" OpenMP mode without relying on POSIX or
    WIN32 locking APIs.

  - configure.ac: --without-threads no longer disables use of
    OpenMP.  Use the already existing option --disable-openmp to
    disable OpenMP.

2014-01-12  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - magick/common.h: Support use of clang/llvm \_\_attribute\_\_ and
    \_\_builtin extensions similar to the existing support for GCC.

2014-01-05  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - Magick++/lib/Image.cpp (thumbnail): New method for fast image
    resizing, particularly to make thumbnails.

  - coders/gif.c: Log when Netscape loop exension is read and
    written.

  - coders/png.c (WriteOnePNGImage): In optimize mode, disable matte
    channel immediately if there are no non-opaque pixels.  Also added
    some useful logging.  Resolves SourceForge issue #252 "convert an
    8bit PNG result in a corrupted image ".

  - wand/magick\_wand.c (MagickSetImageGravity): New Wand method to
    set image gravity.
    (MagickGetImageGravity): New wand method to get image gravity.

2014-01-02  Glenn Randers-Pehrson  <glennrp@simple.dallas.tx.us>

  - coders/png.c (ReadOnePNGImage): Use libpng function
    png\_set\_strip\_16\_to\_8() when scaling 16-bit input PNG down to
    8-bit in a Q8 build.  The png\_set\_scale\_16\_to\_8() function is
    more accurate, but the slight difference causes reference tests
    to fail and causes unexpected difference between the behavior
    of PNG and other formats.  If png\_set\_strip\_16\_to\_8() is not
    supported in libpng, then we use png\_set\_scale\_16\_to\_8() if
    that is available.

2014-01-01  Bob Friesenhahn  <bfriesen@simple.dallas.tx.us>

  - INSTALL-windows.txt: Update for 2014.

  - INSTALL-unix.txt: Update for 2014.

  - Copyright.txt: Update for 2014.

  - NEWS.txt: Update for 2014.

  - README.txt: Update for 2014.

  - doc: Update for 2014.

  - www: Update for 2014.

  - VisualMagick/installer: Update for 2014.

  - ChangeLog: Rotate Changelog to ChangeLog.2013 for 2014.

