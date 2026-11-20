# Hoosier Daddy Photobooth 🔴⚪

Put your face on an Indiana Hoosiers legend. Pick an athlete or coach, turn on
the camera, line your face up in the oval, and a 3-2-1 countdown snaps the
picture. Then save it or share it.

**Private by design:** everything runs in the visitor's browser. No server, no
uploads, no storage. The camera turns off the moment the photo is taken, and
closing the page throws the photo away.

## Turn the site on (GitHub Pages)

1. In this repo go to **Settings → Pages**.
2. Under "Build and deployment" pick **Deploy from a branch**, branch `main`,
   folder `/ (root)`, and Save.
3. In a minute or two it's live at `https://hoosierdaddybg.github.io/photobooth/`.
   Hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) after changes.

The camera only works over `https://` (GitHub Pages is fine). Opening
`index.html` straight from your computer won't get camera access.

## Change stuff

Everything you'd want to change is in **`settings.js`**: the title, the
banner text printed on photos, colors, countdown length, and the list of
athletes ("cutouts").

### Add a photo for someone

1. Put the picture in an `images/` folder (any name is fine, e.g.
   `images/beaumont.jpg`).
2. In `settings.js`, set that athlete's `image:` to `"images/beaumont.jpg"`.
3. Open `face-finder.html` on the live site, choose "your own picture", drag a
   box over the face, and paste the `face:` line it prints into settings.
4. Fill in `credit:` with who took the photo and its license.

### Add a new athlete

Copy one of the blocks in `cutouts`, give it a new `id`, and change the fields.

## Files

- `index.html`, `style.css`: the page and its retro look
- `settings.js`: all the customization
- `photobooth.js`: the camera/countdown/photo engine
- `face-finder.html`: helper for placing the face oval
- `CREDITS.md`: where every photo came from and its license

Not affiliated with Indiana University.
