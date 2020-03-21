Introduction

A decision-making matrix is, in essence, an elevated, quantified pro-con list.
It is used when a single candidate needs to be chosen among multiple and there
are factors in each candidate that need to be taken into account when making the
decision. To use the matrix, enumerate each factor and assign it a numerical
weight. For each candidate, give it a score for all the criteria. The best
candidate will be the one with the highest total weighted score.

I like to use the example of a high school senior determining what college is
the best choice for him. He would determine factors like cost, size,
location/distance from home, course offerings, school colors, etc. and give them
a weight proportional to how important each is (factors like cost and location
would hopefully be weighted more than school colors). Then, he would give each
college a score corresponding to each factor, sum the scores, and choose to
attend the college with the highest score.

Note that the scales are somewhat arbitrary. While there are few constraints on
what kind of numbers can be assigned to weights and scores, it is recommended
that all candidates are scored on the same scale and the scale is not arbitrary.

My application consists of three parts: the HTML document, an external script,
and an external stylesheet.

decision-matrix.html

The HTML document contains all the visual components of the program: The header,
the rows of input fields, the buttons, the table and the svg canvas. It links to
the external stylesheet and script, but its elements are pretty
self-explanatory. They are able to be manipulated (with user input) by the
script, but they are mostly there to display content to the user and allow for
interactivity. This is the main HTML component of the application.

script.js

The script contains the bulk of code for the assignment. It stores the
information inputted by the user (the candidates, the criteria and their
weights) to be used for calculating the best option. It also binds click events
to the buttons to provide functionality that the user expects--when "add
criteria" is clicked, this script updates the list of criteria and puts it in
the matrix. It also uses d3 methods to append an interactive bubble chart once
all the scores are inputted. It uses mouseover events and tooltips to reveal
more information when the user hovers over parts of the program. This is the
main JavaScript component of the application.

dmm-style.css

This is the external stylesheet. It simply specifies the layout of the
application and applies a particular aesthetic to all the elements (coloring,
font family, rounded corners, etc). There is also an important
property--scroll-behavior: smooth--that makes the scrolling of the page a little
more obvious and intuitive. This is the main CSS component of the application.

header.svg

This is just a picture making up the header of the program! I wanted a specific
text style for the title that I didn't know how to do in CSS, and I wanted to
use a font I had downloaded on my computer, so I made the header in Illustrator
and linked it in the document.
