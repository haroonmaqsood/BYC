### INSTALL


### DEPLOY
http://stackoverflow.com/questions/8332333/node-js-setting-up-environment-specific-configs-to-be-used-with-everyauth

cd /home/dev/hairshare

NODE_ENV=production node bin/www


NODE_ENV=production forever bin/www


NODE_ENV=production forever start --spinSleepTime 10000 bin/www

/etc/init.d/mysql stop / start / restart

### TODO
- Cropping tool
- Like button styling
- Upload Page
- If someone follows 3 people then they are forced to the follow tab.
- Invert like so when someone likes you then the counter goes up. 

##### ALEX
- Placeholder Image
- Vector hairshare shape


#### Technical
- Create install doc above
- Add Comments Blog
- Use Async Lib
- 


### API
POPULAR: /api/popular?from=0&too=10
FOLLOWING: /api/following?from=0&too=10

