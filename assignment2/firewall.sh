sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 2376/tcp
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp
sudo ufw reload
sudo ufw app list
sudo ufw app info OpenSSH
