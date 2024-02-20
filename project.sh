#!/bin/bash

# ----
# Text Colors and Messaging Functions

textReset=$(tput sgr0)
textRed=$(tput setaf 1)
textGreen=$(tput setaf 2)
textYellow=$(tput setaf 3)

message_info () {
  echo "$textGreen[project]$textReset $1"
}
message_warn () {
	echo "$textYellow[project]$textReset $1"
}
message_error () {
	echo "$textRed[project]$textReset $1"
}

# ----
# Help Output

show_help () {
	echo ""
	message_info "This script performs the necessary command-line operations for this app."
	message_info ""
	message_info "The following options are available:"
	message_info ""
	message_info "    -c (--clean): Removes generated directories and content. Combine with -i."
	message_info "    -h (--help): Displays this help message."
	message_info "    -i (--init): Runs all operations necessary for initialization."
	message_info "    -n (--icons): Generates icons and images."
	message_info ""
	message_info "Examples:"
	message_info ""
	message_info "    ./project.sh   # This is the same as using the -i option."
	message_info "    ./project.sh -c -i"
	echo ""
}

# ----
# Script Option Parsing

init=0;
icons=0;
clean=0;

while :; do
	case $1 in
		-h | --help | -\?)
			show_help
			exit 0
			;;
		-i | --init)
			init=1
			;;
		-n | --icons)
			icons=1
			;;
		-c | --clean)
			clean=1
			;;
		--) # End of all options
			break
			;;
		-*)
			echo ""
			message_error "WARN: Unknown option (ignored): $1"
			show_help
			exit 1
			;;
		*)  # no more options. Stop while loop
			break
			;;
	esac
	shift
done

if [[ $icons = 0 ]] && [[ $clean = 0 ]] ; then
	# If no options specified then we're doing initialization.
	init=1
fi

# ----
# Clean

if [[ $clean = 1 ]] ; then
	if [[ -d "public/favicons" ]] ; then
		message_info "Removing 'favicons' directory."
		rm -rf public/favicons
	fi
fi

if [[ $icons = 0 ]] && [[ $init = 0 ]] ; then
	exit 0
fi

# ----
# Generate favicons

if [[ $init = 1 ]] || [[ $icons = 1 ]] ; then

    message_info "Generating www favicons..."
	mkdir -p public/favicons
	jq -r '."common" + ."android" + ."ios" + ."windows" | .[] | [.filename, .width, .height] | @tsv' config/web-favicons.json |
	  while IFS=$'\t' read -r filename width height; do
	    inkscape config/logo-only.svgz --export-width "$width" --export-height "$height" --export-filename "public/favicons/$filename"
	  done
	convert "public/favicons/favicon*.png" public/favicons/favicon.ico
fi
