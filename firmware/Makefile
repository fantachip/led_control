TARGET=firmware

all: 
	avr-gcc -mmcu=atmega88 -std=c99 -o $(TARGET).elf main.c
	avr-objcopy -j .text -j .data -O ihex $(TARGET).elf $(TARGET).hex
	
install: 
	make
	avrdude -p m88 -c usbasp -e -U flash:w:$(TARGET).hex
