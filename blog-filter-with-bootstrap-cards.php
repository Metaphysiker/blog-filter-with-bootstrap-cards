<?php

/*
Plugin Name:  Blog Filter With Bootstrap Cards
Version: 1.8
Description: Filters posts by categories
Author: Sandro Räss - s.raess@me.com
*/

function bootstrap_cards_function($atts){

  // Custom CSS
  wp_register_style('prefix_custom_css', plugin_dir_url( __FILE__ ) . '/css/master-blog-filter-with-bootstrap_cards.min.css');
  wp_enqueue_style('prefix_custom_css');

  // Custom JS
  wp_enqueue_script('prefix_custom_js', plugin_dir_url( __FILE__ ) . '/javascript/master-blog-filter-with-bootstrap-cards.min.js');
  wp_enqueue_script('prefix_custom_js');

  $a = shortcode_atts( array(
    'categories-to-be-excluded' => '0',
    'per-page' => '50',
  ), $atts );

$return_string.= <<<HEREDOC



<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

<div class="container-fluid bootstrap_cards_container" data-categories-to-be-excluded={$a["categories-to-be-excluded"]} data-per-page={$a["per-page"]}>

   <div class="bootstrap_cards_buttons_container mb-5 text-center">

    <div class="bootstrap_cards_buttons_for_main_categories text-center">
    Main Categories
    </div>

    <div class="bootstrap_cards_buttons_for_sub_categories text-center">
    Sub Categories
    </div>
   </div>

   <div class="bootstrap_cards_spinner" style="display:none;">
     <div class="text-center">
       <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
     </div>
   </div>

   <div class="bootstrap_cards_items_container row row-cols-1 row-cols-md-2 row-cols-xl-3 g-5">

   </div>

   <div class="bootstrap_cards_load_more_button_container text-center">

   </div>
</div>


HEREDOC;


$return_string.= $str;

   wp_reset_query();
   return $return_string;
}

function register_shortcodes(){
   add_shortcode('blog-filter-with-bootstrap-cards', 'bootstrap_cards_function');
}

function prefix_enqueue()
{
    //jQuery
    //wp_register_script('prefix_jquery', 'https://code.jquery.com/jquery-3.6.0.min.js');
    //wp_enqueue_script('prefix_jquery');

    // JS
    //wp_register_script('prefix_bootstrap_js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');
    //wp_enqueue_script('prefix_bootstrap_js');

    // Custom CSS
    //wp_register_style('prefix_custom_css', plugin_dir_url( __FILE__ ) . '/css/master-blog-filter-with-bootstrap_cards.min.css');
    //wp_enqueue_style('prefix_custom_css');

    // CSS
    //wp_register_style('prefix_bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
    //wp_enqueue_style('prefix_bootstrap');

    // Custom JS
    //wp_enqueue_script( 'prefix_custom_js', plugin_dir_url( __FILE__ ) . '/javascript/master-blog-filter-with-bootstrap-cards.js');
    //wp_enqueue_script('prefix_custom_js');

    //wp_register_style('prefix_custom_css2', plugin_dir_url( __FILE__ ) . '/css/spinner.css');
    //wp_enqueue_style('prefix_custom_css2');
}

//add_action( 'init', 'prefix_enqueue');
add_action( 'init', 'register_shortcodes');

/** Always end your PHP files with this closing tag */
?>
