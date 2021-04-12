There's a white flash when opening the tab. Attempted to move css into
index.html instead of app which improved a bit but still visible.

Attempted to set new tab bkg color:

```src/manifest.json
"theme": {
    "colors" : {
      "ntp_background": [30, 30, 30]
    }
}
```

This style's Google's tab page... no white flash. But blocks our extension from
taking over the tab page so not really what we want.

Also, this is fixed in manifest so couldn't change as the user changes theme.
