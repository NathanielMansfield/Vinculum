import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class MovieSearch extends JFrame {
    private JTextField SearchBar;
    private JLabel MovieSerachTxt;
    private JLabel WebSiteName;
    private JPanel rootPanel;
    private JButton searchButton;


    public MovieSearch(){

        add(rootPanel);
    setTitle("Vinculum.com");
    setSize(400,500);

        searchButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               JOptionPane.showMessageDialog(rootPanel, "Movie found");

            }
        });
    }
}