import { StyleSheet } from 'react-native';

export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // ========== HEADER SECTION ==========
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  menuButton: {
    padding: 8,
  },

  profileButton: {
    padding: 4,
  },

  // ========== SEARCH SECTION ==========
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F0F0F',
    padding: 0,
    margin: 0,
  },

  // ========== CONTACTS LIST SECTION ==========
  contactsListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },

  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  contactInfo: {
    flex: 1,
  },

  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F0F0F',
  },

  contactCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },

  contactCategoryText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },

  // ========== EMPTY STATE ==========
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '500',
  },

  // ========== ACTION CONTAINER ==========
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
  },

  
createButton: {
  flexDirection: 'row',
  backgroundColor: '#D4AF37',
  paddingVertical: 20,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  width: '90%',       // 🔥 90% width
  alignSelf: 'center',
},

  createButtonText: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
  },

  // ========== FOOTER TABS ==========
  footerTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
  },

  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  footerTabActive: {
    borderTopWidth: 3,
    borderTopColor: '#D4AF37',
  },

  footerTabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
    marginTop: 4,
  },

  footerTabLabelActive: {
    color: '#000',
    fontWeight: '600',
  },
});

export default landingStyles;
