import { Card, Row } from "antd";
import Button from "../Button/Button";
import "./style.css";
function Cards({ currentBalance,income,expenses,showExpenseModal,showIncomeModal }) {

  const reset = () => {};

 

  return (
    <Row className="card-row">
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>₹{currentBalance}</p>
        <Button text={"Reset Balance"} blue onClick={reset} />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>₹{income}</p>

        <Button text={"Add Income"} blue onClick={showIncomeModal} />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>₹{expenses}</p>
        <Button text={"Add Income"} blue onClick={showExpenseModal} />
      </Card>
    </Row>
  );
}

export default Cards;
