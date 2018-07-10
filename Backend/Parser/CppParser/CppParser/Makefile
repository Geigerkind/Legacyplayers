CC = clang++
CFLAGS = -O3 -std=c++17 -g -c -Wall -Wno-missing-braces
TARGET = Backend
LIBS = -L/usr/lib -L/usr/local/lib -lstdc++ -lodbc -lmyodbc5a -pthread -lstdc++fs

OBJECTS = $(patsubst %.cpp, %.o, $(wildcard *.cpp))
HEADERS = $(wildcard *.h)

%.o: %.cpp $(HEADERS)
	$(CC) $(CFLAGS) -c $< -o $@

.PRECIOUS: $(TARGET) $(OBJECTS)

$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -Wall $(LIBS) -o $@

clean:
	-rm -f *.o
	-rm -f $(TARGET)

