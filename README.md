# twitter-stream

A simple simulator pushing a configurable amount of text to a socket

## Configuration

| Variable | Description | Values |
|-:|:-|:-|
| TPS | Tweets pr. second | int |
| REPEAT | Read the DATAFILE from the beginning when it reaches the end | true / false |
| CUTOFF | Stop stream after this number of Tweets | int / null |
| BUFFER_THRESHOLD | Minimum factor of TPS to keep in buffer | int |
| DATAFILE | Source file to read text from. Each line is streamed as a Tweet | string |
| PORT | Output port for the socket | int |

Data is emitted to the socket on port **PORT** every second with the number **TPS** as a list of Tweets, collected from lines in the **DATAFILE**. The lines are loaded into a buffer, and the buffer size is always larger than **TPS * BUFFER_THRESHOLD**. If **REPEAT** is `true`, the server will continue until it reaches the **CUTOFF**, reading the **DATAFILE** again if it reaches the end. If **REPEAT** is `false`, and **CUTOFF** is `null`, the server will continue until it has read all lines in the **DATAFILE**. 
