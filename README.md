# Framework Laptop 16 LED Matrix Input Module Control

[View it in your browser.](https://jpadgett314.github.io/dotmatrixtool/)

⚠️ You need to be running a browser based on Chrome (Edge, Chromium, Opera, etc.) ⚠️

This is forked from forked from [FrameworkComputer/dotmatrixtool](https://github.com/FrameworkComputer/dotmatrixtool).

Notable features unique to this fork include: 

- Non-binary (grayscale) matrix modifications 
- Framework logo pattern preset

## More Information

- [Framework Laptop 16](https://frame.work/products/laptop16-diy-amd-7040)
- [LED Matrix Firmware](https://github.com/FrameworkComputer/inputmodule-rs)
- [LED Matrix Hardware](https://github.com/FrameworkComputer/inputmodules)

## Dot Matrix Tool

LED Matrix Input Module Control is based on code from https://github.com/stefangordon/dotmatrixtool.
See also http://dotmatrixtool.com

## Hosting

The application is hosted on Cloudflare Pages and automatically deployed to
production when code is pushed to the `usbserial` branch and to preview
application when a pull request is opened.

## Contributing

Contributions are welcome. Submit pull requests to the `usbserial` branch.

When preparing your pull request, please be sure:

1. the tool still works with connected LED Matrix Input Modules
2. the HTML is still valid (Node.js installation required): `make validate`

## Hosting

The application is hosted on GitHub Pages and automatically deployed when code
is pushed to the `usbserial` branch.
