server {
    server_name restapi.ikystore.us.kg;  # Ganti dengan domain atau IP VPS Anda
    location / {
        proxy_pass http://localhost:3000;  # Proxy ke port 3000 di mana API berjalan
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/restapi.ikystore.us.kg/fullchain.pem; # mana>
    ssl_certificate_key /etc/letsencrypt/live/restapi.ikystore.us.kg/privkey.pem; # ma>
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = restapi.ikystore.us.kg) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    listen 80;
    server_name restapi.ikystore.us.kg;
    return 404; # managed by Certbot
}