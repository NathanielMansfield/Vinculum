import javax.swing.*;
import java.awt.*;
 
public class SearchBar extends JFrame {
    private JTextField searchable = new JTextField(30);
    private JButton searchB = new JButton("Search");
    private JTable result = new JTable();
    private JPanel panel = new JPanel();
    JLabel lable = new JLabel("Search Movie:");
    private JScrollPane scrollPane = new JScrollPane(result);
 
    public static void main(String[] args) {
        new SearchBar("Vinculum.com");
    }
 
    private SearchBar(String title) throws HeadlessException {
        super(title);
        setSize(600, 600);
        setResizable(true);
        addComponents();
        setTable();
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
    }
 
    private void addComponents() {
    	panel.add(lable);
        panel.add(searchable);
        panel.add(searchB);
        panel.add(scrollPane);
        add(panel);
        
    }
 
    private void setTable() {
       
    }
  
}