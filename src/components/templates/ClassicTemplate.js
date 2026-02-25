import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from '../../styles/templates/classicStyles';

const ClassicTemplate = ({ data, userData, isSelected }) => {
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Classic</Text>
          </View>
        </View>

        <View style={styles.selectionContent}>
          <Text style={styles.selectionName}>{name}</Text>
          <Text style={styles.selectionTitle}>{designation}</Text>

          <View style={styles.divider} />

          <View style={styles.selectionSection}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.selectionValue}>{company}</Text>
          </View>

          <View style={styles.selectionSection}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.selectionValue}>{email}</Text>
          </View>

          <View style={styles.selectionSection}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.selectionValue}>{phone}</Text>
          </View>

          {website && (
            <View style={styles.selectionSection}>
              <Text style={styles.label}>Website</Text>
              <Text style={styles.selectionValue}>{website}</Text>
            </View>
          )}
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
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.contactValue}>{phone}</Text>
            </View>
          )}

          {email && (
            <View style={styles.contactItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.contactValue}>{email}</Text>
            </View>
          )}

          {website && (
            <View style={styles.contactItem}>
              <Text style={styles.label}>Website</Text>
              <Text style={styles.contactValue}>{website}</Text>
            </View>
          )}
        </View>

        {/* Business Description */}
        {(description || businessDescription) && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>About Business</Text>
            <Text style={styles.descriptionText}>{description || businessDescription}</Text>
          </View>
        )}

        {/* Keywords */}
        {searchKeywords && (
          <View style={styles.keywordsSection}>
            <Text style={styles.keywordsLabel}>Keywords</Text>
            <Text style={styles.keywordsText}>{searchKeywords}</Text>
          </View>
        )}

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

export default ClassicTemplate;
