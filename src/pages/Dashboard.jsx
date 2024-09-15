
import Header from "../components/Header/Header";
import Cards from "../components/Card/Cards";
import { useEffect, useState } from "react";
import { Card, Modal, Row } from "antd";
import moment from "moment";
import AddExpense from "../components/Modals/AddExpense";
import AddIncome from "../components/Modals/AddIncome";
import { toast } from "react-toastify";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionsTable/TransactionTable";
import NoTransactions from "../components/TransactionsTable/NoTransactions";

import { Line, Pie } from "@ant-design/charts";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [loading,setLoading] = useState(false)
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);



  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

   
    addTransaction(newTransaction);
    
  };
// , many
  
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      // console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");}
        let newTrans=transactions;
        newTrans.push(transaction);
        setTransactions(newTrans);
        calculateBalance();


      
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }
    
  useEffect(()=>{
    if(user)
    fetchTransaction();
  },[user]);

  
  async function fetchTransaction() {
    setLoading(true);

    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        // console.log(transactionsArray);
        toast.success("Transactions Fetched!");
      } catch (error) {
        console.error("Error fetching transactions: ", error);
        toast.error("Failed to fetch transactions.");
      }
    }
    setLoading(false);
  }

  useEffect(()=>{
    calculateBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[transactions])

  const calculateBalance = ()=>{
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction)=>{
      if(transaction.type=== "income"){
        totalIncome+=transaction.amount;
      }else{
        totalExpense+=transaction.amount;
      }
    })
    setIncome(totalIncome);
    setExpenses(totalExpense);
    setCurrentBalance(totalIncome - totalExpense);

  }

  const sortedTransaction =transactions.sort((a, b) => {
    
      return new Date(a.date) - new Date(b.date);
    })

    const processChartData = () => {
      const balanceData = [];
      const spendingData = {};
  
      transactions.forEach((transaction) => {
        const monthYear = moment(transaction.date).format("MMM YYYY");
        const tag = transaction.tag;
  
        if (transaction.type === "income") {
          if (balanceData.some((data) => data.month === monthYear)) {
            balanceData.find((data) => data.month === monthYear).balance +=
              transaction.amount;
          } else {
            balanceData.push({ month: monthYear, balance: transaction.amount });
          }
        } else {
          if (balanceData.some((data) => data.month === monthYear)) {
            balanceData.find((data) => data.month === monthYear).balance -=
              transaction.amount;
          } else {
            balanceData.push({ month: monthYear, balance: -transaction.amount });
          }
  
          if (spendingData[tag]) {
            spendingData[tag] += transaction.amount;
          } else {
            spendingData[tag] = transaction.amount;
          }
        }
      });
  
      const spendingDataArray = Object.keys(spendingData).map((key) => ({
        category: key,
        value: spendingData[key],
      }));
  
      return { balanceData, spendingDataArray };
    };
  
    const { balanceData, spendingDataArray } = processChartData();
    const cardStyle = {
      boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
      margin: "2rem",
      borderRadius: "0.5rem",
      minWidth: "400px",
      flex: 1,
    };
    const balanceConfig = {
      data: balanceData,
      xField: "month",
      yField: "balance",
    };
  
    const spendingConfig = {
      data: spendingDataArray,
      angleField: "value",
      colorField: "category",
    };
   
  return (
    <>
      <Header />
      <Cards currentBalance={currentBalance} income={income} expenses={expenses} showExpenseModal={showExpenseModal}   showIncomeModal={showIncomeModal} />
      {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>Total Spending</h2>
                  {spendingDataArray.length == 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                  ) : (
                    <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                  )}
                </Card>
              </Row>
            </>
          )}
      <Modal  style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null} >Income</Modal>
      <Modal  style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}>Expense</Modal>
      <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} fetchTransaction={fetchTransaction} addTransaction={addTransaction}/>
    </>
  );
}

// export default Dashboard;
