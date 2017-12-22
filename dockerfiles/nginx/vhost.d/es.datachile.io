## Start of configuration add by letsencrypt container
location /.well-known/acme-challenge/ {
    auth_basic off;
    allow all;
    root /usr/share/nginx/html;
    try_files $uri =404;
    break;
}
## End of configuration add by letsencrypt container
proxy_buffering on;
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_types text/css application/json application/javascript text/xml application/xml text/javascript application/x-jsonrecords text/csv image/svg+xml;

location /images {
  alias /datachile-files/images;
}

location /assets {
  alias /datachile-files/assets;
}

location /fonts {
  alias /datachile-files/fonts;
}

location /css {
  alias /datachile-files/css;
}
