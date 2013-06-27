all: 
	make -C firmware
	
install: 
	make -C firmware install
	
run: 
	sudo rm -rf /tmp/server/
	mkdir -p /tmp/server/
	sudo cp -R * /tmp/server/
	sudo chown -R guest:guest /tmp/server
	(cd /tmp/server/web && sudo -u guest node ../server.js)
