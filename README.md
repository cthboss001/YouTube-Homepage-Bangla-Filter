# YouTube Homepage Bangla Filter 🎯

## 📜 Overview
A Tampermonkey script to remove videos with Bangla titles from the YouTube homepage.

## ✨ Features
- 🚫 Hides videos with Bangla (Bengali) characters in their titles.
- 🔄 Works on dynamically loaded content.
- ⚡ Lightweight and automatic.

## 🚀 Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Copy and paste the script into a new Tampermonkey script.
3. Save and open [YouTube](https://www.youtube.com/).

## 🛠️ How It Works
- Detects Bangla characters using Unicode (`\u0980-\u09FF`).
- Hides parent containers of matching videos.
- Uses a MutationObserver for dynamic content.

## 🖥️ Compatibility
- Chrome 🟢
- Firefox 🟠
- Edge 🔵
- Safari 🟣

## 🤝 Contributing
Contributions are welcome! Submit issues or pull requests.

## 📄 License
Licensed under the [MIT License](https://opensource.org/licenses/MIT).

Enjoy your filtered YouTube experience! 🎉
