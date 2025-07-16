import food from "../assets/food.png"
import { useNavigate } from "react-router-dom";
import { Card, Button, Col } from "react-bootstrap";

const Food = () => {
    const imgStyle = {
        height: "300px", // Set a consistent height
        width: "400px", // Full width of the card
        objectFit: "contain", // Maintain aspect ratio and fill the space
      };
    
      const navigate = useNavigate(); // Initialize the navigate function
    
      const handleFood = () => {
        navigate("/food"); // Navigate to the Food page
      };
    return ( <>
         {/* Box 2 */}
         <Col md={4} className="mb-4">
         <Card>
            <br />
           <Card.Img src={food} style={imgStyle} className="mx-auto d-block" />
           <Card.Body>
             <Card.Text style={{ textAlign: "center" }}>Food</Card.Text>
             <Button className="btn" onClick={handleFood}>
               Pick
             </Button>
           </Card.Body>
         </Card>
       </Col>
       </>
    )
}

export default Food;