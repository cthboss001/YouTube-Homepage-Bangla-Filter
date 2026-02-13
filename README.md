# YouTube Homepage Bangla & Hindi Filter

A lightweight and optimized Tampermonkey script that automatically filters out videos with Bangla and Hindi titles from your YouTube feed.

## 🚀 Features

- ✨ **Automatic Filtering**: Instantly hides videos with Bangla (বাংলা) and Hindi (हिन्दी) titles
- ⚡ **Performance Optimized**: Minimal CPU usage with smart batching and debouncing
- 🎯 **Works Everywhere**: Home page, search results, sidebar, and watch page
- 🔄 **Dynamic Content Support**: Handles YouTube's infinite scroll and SPA navigation
- 💾 **Memory Efficient**: Built-in cleanup to prevent memory leaks
- 🎨 **Non-intrusive**: Seamlessly integrates with YouTube's interface

## 📦 Installation

### Method 1: Direct Install (Recommended)

1. **Install Tampermonkey** extension for your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
   - [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)

2. **Click the link below to install the script:**

   ### [🔗 Click Here to Install](https://raw.githubusercontent.com/cthboss001/YouTube-Homepage-Bangla-Filter/main/youtube-bangla-hindi-filter.user.js)

3. Tampermonkey will automatically open and show the installation page
4. Click **Install** and you're done! ✅

### Method 2: Manual Installation

1. Install Tampermonkey (see links above)
2. Click on the Tampermonkey icon in your browser
3. Select **"Create a new script"**
4. Delete the default code
5. Copy and paste the script from [`youtube-bangla-hindi-filter.user.js`](https://github.com/cthboss001/YouTube-Homepage-Bangla-Filter/blob/main/youtube-bangla-hindi-filter.user.js)
6. Press **Ctrl+S** (or **Cmd+S** on Mac) to save
7. Navigate to YouTube and enjoy your filtered feed!

## 🛠️ How It Works

The script uses Unicode character detection to identify Bangla and Hindi text:
- **Bangla** (Bengali): Unicode range `\u0980-\u09FF`
- **Hindi** (Devanagari): Unicode range `\u0900-\u097F`

When a video title contains characters from these ranges, it's automatically hidden from your view.

## ⚙️ Performance Optimizations

- **Batch Processing**: Groups DOM operations to reduce layout thrashing
- **Smart Caching**: Marks processed elements to avoid redundant checks
- **Debounced Execution**: Delays processing to reduce CPU usage
- **Efficient Selectors**: Targets specific YouTube elements for faster queries
- **Memory Management**: Automatic cleanup on page navigation

## 🐛 Debugging

Open your browser's console (F12) and type:
```javascript
ytFilterDebug()
```

This will show:
- Number of filtered videos
- Total video elements on the page

## 📝 Compatibility

- ✅ YouTube Homepage
- ✅ Search Results
- ✅ Watch Page (Sidebar & Up Next)
- ✅ Channel Pages
- ✅ Subscriptions Feed
- ✅ Trending Page
- ✅ Playlists

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs by opening an [issue](https://github.com/cthboss001/YouTube-Homepage-Bangla-Filter/issues)
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This script is for personal use only. It modifies the YouTube interface locally in your browser and does not interact with YouTube's servers. Use at your own discretion.

## 💬 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/cthboss001/YouTube-Homepage-Bangla-Filter/issues) page
2. Create a new issue with details about your problem
3. Include your browser and Tampermonkey version

## 🌟 Show Your Support

If this script helped you, consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs you find
- 🔄 Sharing with others who might find it useful

---

**Made with ❤️ for a better YouTube experience**
