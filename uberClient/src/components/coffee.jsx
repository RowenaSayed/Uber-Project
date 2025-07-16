import { Card, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import coffee from "../assets/coffee.png"

function Coffee() {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleCoffee = () => {
      navigate("/coffee"); // Navigate to the Coffee page
    };
    const imgStyle = {
        height: "300px", // Set a consistent height
        width: "400px", // Full width of the card
        objectFit: "contain", // Maintain aspect ratio and fill the space
      };
    
  return (
    <div>
      {/* Box 3 */}
      <Col md={4} className="mb-10">
            <Card>
                <br/>
              <Card.Img
                src={coffee}
                style={imgStyle}
                className="mx-auto d-block"
              />
              <Card.Body>
                <Card.Text style={{ textAlign: "center" }}>Coffee</Card.Text>
                <Button className="btn" onClick={handleCoffee}>
                  Pick
                </Button>
              </Card.Body>
            </Card>
          </Col>
    </div>
  )
}

export default Coffee
