#include <gtk/gtk.h>
#include <stdlib.h>

/* Test
 * multiline
 * comment */

/* N I G G A */

//Test single line comment
//Another test

//Yet another test

void destroy( GtkWidget *widget, gpointer data);

int main(int argc, char **argv)
{
   GtkWidget *window;

   gtk_init(&argc, &argv);

   window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
   gtk_window_set_title(GTK_WINDOW(window), "Test");
   gtk_window_set_default_size(GTK_WINDOW(window), 250, 180);

   g_signal_connect (G_OBJECT (window), "destroy",G_CALLBACK (destroy), NULL);

   gtk_widget_show_all(window);
   gtk_main();
   return 0;
}

void destroy( GtkWidget *widget, gpointer data )
{
    gtk_main_quit ();
}

