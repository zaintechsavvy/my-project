import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Animated from "react-native-reanimated";
import { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Entry {
  id: string;
  type: "income" | "expense";
  amount: string;
  category: {
    label: string;
    value: string;
    color: string;
    icon: string;
  };
  date: string;
  time: string;
}

const categories = [
  { label: "Salary", value: "salary", color: "#4caf50", icon: "💰" },
  { label: "Food", value: "food", color: "#ff9800", icon: "🍔" },
  { label: "Transport", value: "transport", color: "#03a9f4", icon: "🚗" },
  { label: "Shopping", value: "shopping", color: "#e91e63", icon: "🛍️" },
  { label: "Subscriptions", value: "subscriptions", color: "#9163CD", icon: "🔁" },
  { label: "Utilities", value: "utilities", color: "#9EB1CF", icon: "🚰" },
  { label: "Pay Bill's", value: "paybills", color: "#DB0032", icon: "🧾" },
];

const App = () => {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState(categories[0].value);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");

  const addEntry = () => {
    if ((type === "income" && income) || (type === "expense" && expense)) {
      const amount = parseFloat(type === "income" ? income : expense).toFixed(2);
      const selectedCategory = categories.find((cat) => cat.value === category);
      const currentDate = new Date();
      setEntries([
        ...entries,
        {
          id: Math.random().toString(),
          type,
          amount,
          category: selectedCategory || categories[0], // Handle if selectedCategory is undefined
          date: currentDate.toLocaleDateString(),
          time: currentDate.toLocaleTimeString(),
        },
      ]);
      setIncome("");
      setExpense("");
      setDescription("");
      setModalVisible(false);
    }
  };
  const handleNumericPress = (num: number) => {
    if (type === "income") {
      setIncome((prev) => prev + num.toString());
    } else {
      setExpense((prev) => prev + num.toString());
    }
  };

  const handleDecimalPress = () => {
    if (type === "income") {
      if (!income.includes(".")) {
        setIncome((prev) => prev + ".");
      }
    } else {
      if (!expense.includes(".")) {
        setExpense((prev) => prev + ".");
      }
    }
  };

  const handleConfirm = () => {
    addEntry();
  };

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const styles = darkMode ? darkStyles : lightStyles;
//make a balence box end on two decimal points
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.balanceBox}>
          <Text style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 5,
          }}>Balance</Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            ${totalIncome - totalExpense}
          </Text>
        </View>
        <View style={styles.incomeExpenseContainer}>
          <View style={styles.incomeBox}>
            <Text style={styles.summaryTitle}>Total Income</Text>
            <Text style={styles.incomeAmount}>${totalIncome}</Text>
          </View>
          <View style={styles.expenseBox}>
            <Text style={styles.summaryTitle}>Total Expense</Text>
            <Text style={styles.expenseAmount}>${totalExpense}</Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 21,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Recent Transactions
      </Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.entry,
              {
                backgroundColor: "#f0f0f0",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
              },
            ]}
            entering={FadeInUp.delay(100).duration(300)}
            exiting={FadeOutDown.delay(100).duration(300)}
          >
            <View
              style={{
                backgroundColor: `${item.category?.color}50`,
                width: 45,
                height: 45,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{item.category?.icon}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Text style={styles.amountText}>${item.amount}</Text>
                <Text style={styles.entryText}>
                  {item.category?.label ?? ""}
                </Text>
              </View>
              <Text style={styles.dateTimeText}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
          </Animated.View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  type === "expense" ? styles.activeTab : null,
                ]}
                onPress={() => setType("expense")}
              >
                <Text style={styles.tabText}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  type === "income" ? styles.activeTab : null,
                ]}
                onPress={() => setType("income")}
              >
                <Text style={styles.tabText}>Income</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.amountDisplay}>
              ${type === "income" ? income : expense}
            </Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholderTextColor={darkMode ? "#ccc" : "#555"}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
            <ScrollView style={styles.additionalDetails}>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
                , {new Date().toLocaleTimeString()}
              </Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryIcon}>
                  {categories.find((cat) => cat.value === category)?.icon}
                </Text>
                <Text style={styles.categoryLabel}>
                  {categories.find((cat) => cat.value === category)?.label}
                </Text>
              </View>
            </ScrollView>
            <View style={styles.numericKeypad}>
              <View style={styles.numericRow}>
                {[1, 2, 3].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numericButton}
                    onPress={() => handleNumericPress(num)}
                  >
                    <Text style={styles.numericButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.numericRow}>
                {[4, 5, 6].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numericButton}
                    onPress={() => handleNumericPress(num)}
                  >
                    <Text style={styles.numericButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.numericRow}>
                {[7, 8, 9].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numericButton}
                    onPress={() => handleNumericPress(num)}
                  >
                    <Text style={styles.numericButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.numericRow}>
                <TouchableOpacity
                  style={styles.numericButton}
                  onPress={() => handleNumericPress(0)}
                >
                  <Text style={styles.numericButtonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.numericButton}
                  onPress={handleDecimalPress}
                >
                  <Text style={styles.numericButtonText}>.</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.checkButtonText}>✔️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const baseStyles = {
  container: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  balanceBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  incomeExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  incomeBox: {
    flex: 1,
    backgroundColor: "rgba(76, 175, 80, 0.1)", // Green with lower opacity
    padding: 15,
    borderRadius: 12,
    marginRight: 5,
  },
  expenseBox: {
    flex: 1,
    backgroundColor: "rgba(233, 30, 99, 0.1)", // Red with lower opacity
    padding: 15,
    borderRadius: 12,
    marginLeft: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  incomeAmount: {
    fontSize: 20,
    color: "#4caf50", // Green color for income
  },
  expenseAmount: {
    fontSize: 20,
    color: "#e91e63", // Red color for expense
  },
  entry: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#888",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196f3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 9,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 6,
    borderBottomColor: "green",
  },
  tabText: {
    fontSize: 18,
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
  },
  additionalDetails: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  categoryLabel: {
    fontSize: 16,
    color: "#888",
  },
  numericKeypad: {
    width: "100%",
    marginTop: 10,
  },
  numericRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numericButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    padding: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  numericButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  checkButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  checkButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: "#2196f3",
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: "#fff",
  },
  title: {
    ...baseStyles.title,
    color: "#000",
  },
  summaryContainer: {
    ...baseStyles.summaryContainer,
  },
  balanceBox: {
    ...baseStyles.balanceBox,
  },
  incomeExpenseContainer: {
    ...baseStyles.incomeExpenseContainer,
  },
  incomeBox: {
    ...baseStyles.incomeBox,
  },
  expenseBox: {
    ...baseStyles.expenseBox,
  },
  summaryTitle: {
    ...baseStyles.summaryTitle,
    color: "#000",
  },
  summaryAmount: {
    ...baseStyles.summaryAmount,
    color: "#000",
  },
  incomeAmount: {
    ...baseStyles.incomeAmount,
  },
  expenseAmount: {
    ...baseStyles.expenseAmount,
  },
  entry: {
    ...baseStyles.entry,
  },
  entryText: {
    ...baseStyles.entryText,
    color: "#000",
  },
  amountText: {
    ...baseStyles.amountText,
    color: "#000",
  },
  dateTimeText: {
    ...baseStyles.dateTimeText,
  },
  addButton: {
    ...baseStyles.addButton,
  },
  addButtonText: {
    ...baseStyles.addButtonText,
  },
  modalContainer: {
    ...baseStyles.modalContainer,
  },
  modalContent: {
    ...baseStyles.modalContent,
  },
  modalTitle: {
    ...baseStyles.modalTitle,
    color: "#000",
  },
  tabContainer: {
    ...baseStyles.tabContainer,
  },
  tabButton: {
    ...baseStyles.tabButton,
  },
  activeTab: {
    ...baseStyles.activeTab,
  },
  tabText: {
    ...baseStyles.tabText,
    color: "#000",
  },
  amountDisplay: {
    ...baseStyles.amountDisplay,
    color: "#000",
  },
  input: {
    ...baseStyles.input,
    color: "#000",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
  },
  picker: {
    ...baseStyles.picker,
    color: "#000",
  },
  additionalDetails: {
    ...baseStyles.additionalDetails,
  },
  dateText: {
    ...baseStyles.dateText,
  },
  categoryTag: {
    ...baseStyles.categoryTag,
  },
  categoryIcon: {
    ...baseStyles.categoryIcon,
  },
  categoryLabel: {
    ...baseStyles.categoryLabel,
  },
  numericKeypad: {
    ...baseStyles.numericKeypad,
  },
  numericRow: {
    ...baseStyles.numericRow,
  },
  numericButton: {
    ...baseStyles.numericButton,
  },
  numericButtonText: {
    ...baseStyles.numericButtonText,
  },
  checkButton: {
    ...baseStyles.checkButton,
  },
  checkButtonText: {
    ...baseStyles.checkButtonText,
  },
  modalCloseButton: {
    ...baseStyles.modalCloseButton,
  },
  modalCloseButtonText: {
    ...baseStyles.modalCloseButtonText,
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: "#333",
  },
  title: {
    ...baseStyles.title,
    color: "#fff",
  },
  summaryContainer: {
    ...baseStyles.summaryContainer,
  },
  balanceBox: {
    ...baseStyles.balanceBox,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  incomeExpenseContainer: {
    ...baseStyles.incomeExpenseContainer,
  },
  incomeBox: {
    ...baseStyles.incomeBox,
    backgroundColor: "rgba(76, 175, 80, 0.2)", // Green with lower opacity
  },
  expenseBox: {
    ...baseStyles.expenseBox,
    backgroundColor: "rgba(233, 30, 99, 0.2)", // Red with lower opacity
  },
  summaryTitle: {
    ...baseStyles.summaryTitle,
    color: "#fff",
  },
  summaryAmount: {
    ...baseStyles.summaryAmount,
    color: "#fff",
  },
  incomeAmount: {
    ...baseStyles.incomeAmount,
    color: "#4caf50", // Green color for income
  },
  expenseAmount: {
    ...baseStyles.expenseAmount,
    color: "#e91e63", // Red color for expense
  },
  entry: {
    ...baseStyles.entry,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  entryText: {
    ...baseStyles.entryText,
    color: "#fff",
  },
  amountText: {
    ...baseStyles.amountText,
    color: "#fff",
  },
  dateTimeText: {
    ...baseStyles.dateTimeText,
    color: "#ccc",
  },
  addButton: {
    ...baseStyles.addButton,
    backgroundColor: "#2196f3",
  },
  addButtonText: {
    ...baseStyles.addButtonText,
    color: "#fff",
  },
  modalContainer: {
    ...baseStyles.modalContainer,
  },
  modalContent: {
    ...baseStyles.modalContent,
    backgroundColor: "#222",
  },
  modalTitle: {
    ...baseStyles.modalTitle,
    color: "#fff",
  },
  tabContainer: {
    ...baseStyles.tabContainer,
  },
  tabButton: {
    ...baseStyles.tabButton,
    backgroundColor: "#444",
  },
  activeTab: {
    ...baseStyles.activeTab,
    borderBottomColor: "#4caf50",
  },
  tabText: {
    ...baseStyles.tabText,
    color: "#fff",
  },
  amountDisplay: {
    ...baseStyles.amountDisplay,
    color: "#fff",
  },
  input: {
    ...baseStyles.input,
    color: "#fff",
    borderBottomColor: "#666",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
  },
  picker: {
    ...baseStyles.picker,
    color: "#fff",
  },
  additionalDetails: {
    ...baseStyles.additionalDetails,
    backgroundColor: "#444",
  },
  dateText: {
    ...baseStyles.dateText,
    color: "#ccc",
  },
  categoryTag: {
    ...baseStyles.categoryTag,
  },
  categoryIcon: {
    ...baseStyles.categoryIcon,
    color: "#ccc",
  },
  categoryLabel: {
    ...baseStyles.categoryLabel,
    color: "#ccc",
  },
  numericKeypad: {
    ...baseStyles.numericKeypad,
  },
  numericRow: {
    ...baseStyles.numericRow,
  },
  numericButton: {
    ...baseStyles.numericButton,
    backgroundColor: "#555",
  },
  numericButtonText: {
    ...baseStyles.numericButtonText,
    color: "#fff",
  },
  checkButton: {
    ...baseStyles.checkButton,
    backgroundColor: "#4caf50",
  },
  checkButtonText: {
    ...baseStyles.checkButtonText,
    color: "#fff",
  },
  modalCloseButton: {
    ...baseStyles.modalCloseButton,
  },
  modalCloseButtonText: {
    ...baseStyles.modalCloseButtonText,
    color: "#2196f3",
  },
});

export default App;
