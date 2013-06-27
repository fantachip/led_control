#include <avr/io.h>

#define F_CPU 18432000UL

void toggle_led(uint8_t num){
	DDRC |= 0x3;
	if(PORTC & _BV(num))
		PORTC &= ~_BV(num);
	else 
		PORTC |= _BV(num);
}

static uint8_t UART_DataReady(){
	return UCSR0A & _BV(RXC0);
}

static void UART_PutChar(uint8_t c) {
    loop_until_bit_is_set(UCSR0A, UDRE0); /* Wait until data register empty. */
    UDR0 = c;
}

static uint8_t UART_GetChar(void) {
    loop_until_bit_is_set(UCSR0A, RXC0); /* Wait until data exists. */
    return UDR0;
}

void UART_Init(uint16_t bp){
	UBRR0L = (uint8_t)bp;
	UBRR0H = bp >> 8; 
	
	UCSR0B=(1<<RXEN0)|(1<<TXEN0); //|(1<<RXCIE0);
}


int main(){
	UART_Init((F_CPU / (16UL * 9600)) - 1);
	
	while(1){
		if(UART_DataReady()){
			uint8_t byte = UART_GetChar(); 
			toggle_led(byte); 
			UART_PutChar(PORTC & 0x03); 
		}
	} 
	return 0; 
}
