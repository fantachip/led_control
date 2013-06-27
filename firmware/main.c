/*********************************************

For more projects, visit https://github.com/fantachip/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
**********************************************/

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
