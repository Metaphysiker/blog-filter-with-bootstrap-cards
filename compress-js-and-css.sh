#!/bin/bash
#yarn run minify css/blog-filter-with-bootstrap-cards.css > css/blog-filter-with-bootstrap-cards.min.css
#tail -n +3 css/blog-filter-with-bootstrap-cards.min.css > temp.txt ; mv temp.txt css/blog-filter-with-bootstrap-cards.min.css
#head -n -1 css/blog-filter-with-bootstrap-cards.min.css > temp.txt ; mv temp.txt css/blog-filter-with-bootstrap-cards.min.css

yarn run minify css/spinner.css > css/spinner.min.css
tail -n +3 css/spinner.min.css > temp.txt ; mv temp.txt css/spinner.min.css
head -n -1 css/spinner.min.css > temp.txt ; mv temp.txt css/spinner.min.css

truncate -s 0 css/master-blog-filter-with-bootstrap_cards.min.css

#cat temp.txt css/blog-filter-with-bootstrap-cards.min.css >> css/master-blog-filter-with-bootstrap_cards.min.css
cat css/spinner.min.css >> css/master-blog-filter-with-bootstrap_cards.min.css

rm -f css/blog-filter-with-bootstrap-cards.min.css
rm -f css/spinner.min.css

yarn run uglifyjs javascript/blog-filter-with-bootstrap-cards.js -c -m reserved=['bootstrap_cards_object'] -o javascript/master-blog-filter-with-bootstrap-cards.min.js

zip -r blog-filter-with-bootstrap-cards "blog-filter-with-bootstrap-cards.php" "css/master-blog-filter-with-bootstrap_cards.min.css" "javascript/master-blog-filter-with-bootstrap-cards.min.js"
