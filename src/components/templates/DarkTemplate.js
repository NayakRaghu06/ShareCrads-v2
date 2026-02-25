import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../../styles/templates/darkStyles';

const DarkTemplate = ({ data, userData, isSelected }) => {
  // Support both 'data' (from TemplatePreviewScreen) and 'userData' (from SelectTemplateScreen)
  const cardData = data || userData || {};
  
  const {
    name = 'John Doe',
    designation = 'Business Title',
    company = 'Company Name',
    phone = '+1 (555) 123-4567',
    email = 'email@example.com',
    website = 'www.example.com',
    description = '',
    businessDescription = '',
    searchKeywords = '',
    linkedin = '',
    instagram = '',
    twitter = '',
  } = cardData;

  // If this is being used for template selection (isSelected prop is true)
  if (isSelected === true) {
    return (
      <View style={[styles.selectionContainer, isSelected && styles.selected]}>
        <View style={styles.selectionHeader}>
          <View style={styles.accentBar} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Dark</Text>
          </View>
        </View>

        <View style={styles.selectionContent}>
          <Text style={styles.selectionName}>{name}</Text>
          {designation && <Text style={styles.selectionTitle}>{designation}</Text>}

          <View style={styles.divider} />

          <View style={styles.selectionInfoSection}>
            {email && (
              <View style={styles.selectionInfoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.selectionInfoValue}>{email}</Text>
              </View>
            )}

            {phone && (
              <View style={styles.selectionInfoItem}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.selectionInfoValue}>{phone}</Text>
              </View>
            )}

            {company && (
              <View style={styles.selectionInfoItem}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.selectionInfoValue}>{company}</Text>
              </View>
            )}

            {website && (
              <View style={styles.selectionInfoItem}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.selectionInfoValue}>{website}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer} />
      </View>
    );
  }

  // Preview mode (used in TemplatePreviewScreen)
  return (
    <View style={styles.card}>
      {/* Header Background */}
      <View style={styles.headerBackground} />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Image Placeholder */}
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImagePlaceholder}>👤</Text>
        </View>

        {/* Name and Designation */}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.designation}>{designation}</Text>
        {company && <Text style={styles.company}>{company}</Text>}
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        {/* Contact Information */}
        <View style={styles.contactInfo}>
          {phone && (
            <View style={styles.contactItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.contactValue}>{phone}</Text>
            </View>
          )}

          {email && (
            <View style={styles.contactItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.contactValue}>{email}</Text>
            </View>
          )}

          {website && (
            <View style={styles.contactItem}>
              <Text style={styles.infoLabel}>Website</Text>
              <Text style={styles.contactValue}>{website}</Text>
            </View>
          )}
        </View>

        {/* Social Media Links */}
        {(linkedin || instagram || twitter) && (
          <View style={styles.socialMediaSection}>
            <Text style={styles.socialLabel}>Connect</Text>
            <View style={styles.socialLinksContainer}>
              {linkedin && (
                <View style={styles.socialLink}>
                  <Text style={styles.socialIconLabel}>in</Text>
                  <Text style={styles.socialText}>{linkedin}</Text>
                </View>
              )}
              {instagram && (
                <View style={styles.socialLink}>
                  <Text style={styles.socialIconLabel}>ig</Text>
                  <Text style={styles.socialText}>{instagram}</Text>
                </View>
              )}
              {twitter && (
                <View style={styles.socialLink}>
                  <Text style={styles.socialIconLabel}>𝕏</Text>
                  <Text style={styles.socialText}>{twitter}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DarkTemplate;
