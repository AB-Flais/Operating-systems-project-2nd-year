This page has been written and tested on chrome v. 108.0.5359.125 (official build) (64 bits)

This project has been done for my university degree. I'm quite proud of the result so I'll upload it here as my first project. I'll let the statement for the project at the end. Some parts of the project may be in spanish.

The code has been written assuming a correct format of the input file

Those instants that aren't shown are exactly the same as the previous ones

Possibly poor documentation is due to my inexperience with projects like this

Personalization:
  - The background can be disabled by changing the *--background* variable in master.css ninth line as indicated
  - The variable *colors* in listConstructor.js is an array that contains the colors that each new partition will have (excluding the empty ones).
    It loops, so when the fifth is already used it comes back to the first. The code is ready for its length to be changed, feel free to add or remove colors.



To start running the code, open the file gestormemoria.html with your favorite web browser, **and Enjoy!** ;)

---

## Statement: 
> It is intended to make a simulation of memory management with dynamic partitions. A menu will be offered with the two algorythms to implement: **worst gap** and **best gap**. 
> 
> The program will receive an input file containing a line for each process to load with the following format: <Process> <Arrival_instant> <Memory_required> <Execution_time>. The memory total capacity will be 2000 and the minimum allocation unit will be 100. The result, at least, will be saved in a file called "partitions.txt", where the memory status will be represented in lines of text with each input or output of processes, with the format:
> 
> Instant [Start_address_1 Process_name_1 Size_1] ... [Start_address_n Process_name_n Size_n] *break line*
>
> For example: 
>  
> 1 [0 P1 300] [300 P2 200] [500 gap 1500] *break line*
>  
> The previous line indicates that at the instant 1 we have two partitions allocated and a gap. The first partition starts at the address 0, it's occupied for the process P1 and its size is 300. The second partition starts at the address 300, it's occupied for the process P2 and its size is 200. Finally, we have a gap that starts at the address 500 and its size is 1500. Obviously, the sum of 300, 200 and 1500 equals 2000, the memory capacity.
>
> Alternatively, the result may be shown graphically, aspect that will be positively valued (2 points).
>
> Program will be called gestormemoria and must implement the necessary structures to manage the partitions.
>
> **NOTE:** The project may be done in any programming language and on any operating system.
 
