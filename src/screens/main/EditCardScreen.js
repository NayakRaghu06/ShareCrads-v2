import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getDashboard, saveDashboard } from '../../utils/storage';

export default function EditCardScreen({ route, navigation }) {
  const { cardData, cardIndex } = route.params;

  const [name, setName] = useState(cardData.name || '');
  const [companyName, setCompanyName] = useState(cardData.companyName || '');
  const [designation, setDesignation] = useState(cardData.designation || '');
  const [phone, setPhone] = useState(cardData.phone || '');
  const [email, setEmail] = useState(cardData.email || '');
  const [address, setAddress] = useState(cardData.address || '');

  const handleUpdate = async () => {
    let dashboard = await getDashboard();
    dashboard[cardIndex] = {
      ...dashboard[cardIndex],
      name,
      companyName,
      designation,
      phone,
      email,
      address
    };
    await saveDashboard(dashboard);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 100 }}>
        <Text>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
        <Text>Company Name</Text>
        <TextInput value={companyName} onChangeText={setCompanyName} style={styles.input} />
        <Text>Designation</Text>
        <TextInput value={designation} onChangeText={setDesignation} style={styles.input} />
        <Text>Phone</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <Text>Address</Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text>Update Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10
  },
  backText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    backgroundColor: '#fafafa'
  },
  updateBtn: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  }
});
