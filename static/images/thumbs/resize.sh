#!/bin/bash

function loop() {
    ## Do nothing if * doesn't match anything.
    ## This is needed for empty directories, otherwise
    ## "foo/*" expands to the literal string "foo/*"/
    shopt -s nullglob

    for dir in $1/*/
    do
        dir=${dir%*/}
        ## If $file is a directory
        if [ -d "$dir" ]
        then
            echo "FOLDER-> $dir"

            for file in $dir/*.jpg
            do
                echo "  FILE-> $file"
                convert -contrast -gravity center -resize 340x220\^  -extent 340x220  -background white -colorspace RGB -quality 75  -format jpg $file $file
            done

            loop "$dir"
        fi
    done
}
loop "$PWD"