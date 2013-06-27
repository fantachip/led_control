all: 
	make -C firmware
	
install: 
	make -C firmware install
	
run: 
	(cd web && node ../server.js)
