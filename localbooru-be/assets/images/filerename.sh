#!/bin/bash
count=1
echo "Run script"
for file in *.png; do
	mv "$file" "test$count.png"
	((count++))
done
