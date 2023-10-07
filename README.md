# Chrome active tab jump list
This extension will attempt to keep a history of tabs in the order you've clicked on them (meaning you've "activated" or focused a tab) and allow you to navigate that history.  
Registered keyboard shortcuts are current Windows-centric being -  
```
Alt-I -> move forward in list (the next active tab when navigating active tab history)
Alt-O -> move backward in list (the previously active tab in active tab history)
```

This is inspired by how I understand Vim jumplists to work.

***CURRENTLY VERY W.I.P.***

## Getting Started
1. Clone or download this repository to any desired directory
    1. If you download the zip of this repo, you must unzip it
2. In chrome, navigate to chrome://extensions
3. Click load unpacked
4. Navigate to where this folder is (the location you chose in step 1)
5. Select the folder and the extension should be added to you extensions
6. To verify you can open the "service worker" and watch the console output as you click between tabs

Unfortunately, any exceptions that occur is probably due to my own incompetence, and will need to be fixed whenever I eventually encounter them for myself.  
Alternatively, anyone is welcome to open an issue (I think that's possible?)

## TODO
- [ ] Support recording history of tabs between windows (currently does not support multiple chrome windows, and will not function if a tab is moved or opened on separate windows)  
- [ ] Add keyboard shortcuts for other OS's
- [ ] Add an extension popup to configure desired length of history (currently 50 of most recent tabs)
