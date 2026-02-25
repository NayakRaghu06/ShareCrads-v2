import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { contactsStyles } from '../../styles/screens/contactsStyles';
import { COLORS } from '../../styles/colors';
import {
  requestContactPermission,
  readPhoneContacts,
  compareContactsWithUsers,
  getDBCUsers,
} from '../../utils/contacts';
import Footer from '../../components/common/Footer';

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // Step 1: Request contact permission
      const hasPermission = await requestContactPermission();
      
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        setLoading(false);
        return;
      }

      setPermissionGranted(true);

      // Step 2: Read phone contacts
      const phoneContacts = await readPhoneContacts();

      // Step 3: Get DBC users
      const dbcUsers = await getDBCUsers();

      // Step 4: Compare and merge
      const mergedContacts = compareContactsWithUsers(phoneContacts, dbcUsers);
      
      setContacts(mergedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please fill in name and phone number');
      return;
    }

    const updatedContacts = [
      ...contacts,
      {
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email,
        isDBCUser: false,
        dbcUser: null,
      },
    ];
    setContacts(updatedContacts);
    setNewContact({ name: '', phone: '', email: '' });
    setIsAddingContact(false);
    Alert.alert('Success', 'Contact added successfully');
  };

  const handleDeleteContact = (phone) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setContacts(contacts.filter(c => c.phone !== phone));
        },
        style: 'destructive',
      },
    ]);
  };

  const handleViewDBCCard = (contact) => {
    if (contact.isDBCUser) {
      Alert.alert(
        'DBC Card',
        `${contact.name}\nPhone: ${contact.phone}\nCard Type: ${contact.dbcUser?.card}`
      );
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dbcContacts = filteredContacts.filter(c => c.isDBCUser);
  const otherContacts = filteredContacts.filter(c => !c.isDBCUser);

  return (
    <SafeAreaView style={contactsStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />

      {/* Header */}
      <View style={contactsStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={contactsStyles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={() => setIsAddingContact(true)}>
          <Ionicons name="add" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={contactsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={contactsStyles.loadingText}>Reading phone contacts...</Text>
        </View>
      ) : !permissionGranted ? (
        <View style={contactsStyles.loadingContainer}>
          <Ionicons name="lock-closed" size={48} color={COLORS.accent} />
          <Text style={[contactsStyles.loadingText, { marginTop: 16 }]}>Permission Denied</Text>
          <Text style={contactsStyles.permissionText}>We need access to your contacts to find DBC users</Text>
          <TouchableOpacity style={contactsStyles.retryButton} onPress={loadContacts}>
            <Text style={contactsStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={contactsStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={contactsStyles.searchBarContainer}>
            <Ionicons name="search" size={20} color={COLORS.accent} style={contactsStyles.searchIcon} />
            <TextInput
              style={contactsStyles.searchInput}
              placeholder="Search contacts"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
          </View>

          {/* Add Contact Form */}
          {isAddingContact && (
            <View style={contactsStyles.formContainer}>
              <View style={contactsStyles.inputGroup}>
                <Text style={contactsStyles.label}>Name</Text>
                <TextInput
                  style={contactsStyles.input}
                  placeholder="Enter name"
                  value={newContact.name}
                  onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={contactsStyles.inputGroup}>
                <Text style={contactsStyles.label}>Phone</Text>
                <TextInput
                  style={contactsStyles.input}
                  placeholder="Enter phone number"
                  value={newContact.phone}
                  onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={contactsStyles.inputGroup}>
                <Text style={contactsStyles.label}>Email</Text>
                <TextInput
                  style={contactsStyles.input}
                  placeholder="Enter email (optional)"
                  value={newContact.email}
                  onChangeText={(text) => setNewContact({ ...newContact, email: text })}
                  keyboardType="email-address"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={contactsStyles.buttonGroup}>
                <TouchableOpacity
                  style={contactsStyles.cancelButton}
                  onPress={() => {
                    setIsAddingContact(false);
                    setNewContact({ name: '', phone: '', email: '' });
                  }}
                >
                  <Text style={contactsStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={contactsStyles.addButton}
                  onPress={handleAddContact}
                >
                  <Text style={contactsStyles.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* DBC Contacts Section */}
          {dbcContacts.length > 0 && (
            <>
              <View style={contactsStyles.sectionHeader}>
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text style={contactsStyles.sectionTitle}>Using DBC ({dbcContacts.length})</Text>
              </View>
              <View style={contactsStyles.contactsList}>
                {dbcContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.phone}
                    style={contactsStyles.contactItemDBC}
                    onPress={() => handleViewDBCCard(contact)}
                  >
                    <View style={contactsStyles.contactInfo}>
                      <View style={contactsStyles.nameRow}>
                        <Text style={contactsStyles.contactName}>{contact.name}</Text>
                        <View style={contactsStyles.dbcBadge}>
                          <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
                          <Text style={contactsStyles.badgeText}>DBC</Text>
                        </View>
                      </View>
                      <Text style={contactsStyles.contactPhone}>{contact.phone}</Text>
                      {contact.dbcUser?.card && (
                        <Text style={contactsStyles.cardType}>{contact.dbcUser.card} Card</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteContact(contact.phone)}>
                      <Ionicons name="trash-outline" size={20} color={COLORS.accent} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Other Contacts Section */}
          {otherContacts.length > 0 && (
            <>
              <View style={contactsStyles.sectionHeader}>
                <Ionicons name="person-add" size={16} color="#666" />
                <Text style={contactsStyles.sectionTitleOther}>Other Contacts ({otherContacts.length})</Text>
              </View>
              <View style={contactsStyles.contactsList}>
                {otherContacts.map((contact) => (
                  <View key={contact.phone} style={contactsStyles.contactItem}>
                    <View style={contactsStyles.contactInfo}>
                      <Text style={contactsStyles.contactName}>{contact.name}</Text>
                      <Text style={contactsStyles.contactPhone}>{contact.phone}</Text>
                      {contact.email && <Text style={contactsStyles.contactEmail}>{contact.email}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteContact(contact.phone)}>
                      <Ionicons name="trash-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Empty State */}
          {filteredContacts.length === 0 && !isAddingContact && (
            <View style={contactsStyles.emptyState}>
              <Text style={contactsStyles.emptyStateIcon}>👥</Text>
              <Text style={contactsStyles.emptyStateText}>
                {contacts.length === 0 ? 'No contacts found' : 'No contacts match your search'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      <Footer activeTab="contacts" navigation={navigation} fromScreen="Contacts" />
    </SafeAreaView>
  );
}
