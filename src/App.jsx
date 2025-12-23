import { Route, Routes, Outlet } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Layouts/Sidebar';
import Header from './components/Layouts/Header';
import Users from './components/Pages/customers/Users';
import Category from './components/Pages/category/Category';
import Attribute from './components/Pages/Attribute/Attribute';
import Coupon from './components/Pages/Couponcode/Coupon';
import SettingsPage from './components/Pages/Setting/SettingsPage';
import ProfileForm from './components/Pages/Profile/ProfileForm';
import ForgotPassword from './components/Pages/ForgotPassword';
import CreateAccount from './components/Pages/CreateAccount';
import AttributesValues from './components/Pages/Attribute/AttributesValues';
import ViewCategory from './components/Pages/category/ViewCategory';
import ContactList from './components/Pages/Contact/Contacts';
import Blog from './components/Pages/Blog/BlogsList';
import CreateBlog from './components/Pages/Blog/CreateBlog';
import BlogDetails from './components/Pages/Blog/BlogDetails';
import BlogComments from './components/Pages/Blog/BlogComments';
import ReviewsList from './components/Pages/Reviews/ReviewsList';
import TopBusinesses from './components/Pages/Reviews/TopBusinesses';
import BusinessReviews from './components/Pages/Reviews/BusinessReviews';
import EditReview from './components/Pages/Reviews/EditReview';



import ReferralMain from './components/Pages/Referral/ReferralMain';


// Bussiness(Salon and Freelancers)
import SalonsList from './components/Pages/Businesses/SalonsList';
import SalonDetails from './components/Pages/Businesses/SalonDetails';
import EditSalon from './components/Pages/Businesses/EditSalon';
import FreelancersList from './components/Pages/Businesses/FreelancersList';
import FreelancerDetails from './components/Pages/Businesses/FreelancerDetails';
import EditFreelancer from './components/Pages/Businesses/EditFreelancer';

// Banners
import BannersList from './components/Pages/Banners/BannersList';
import CreateBanner from './components/Pages/Banners/CreateBanner';
import EditBanner from './components/Pages/Banners/EditBanner';



const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className={`h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white shadow">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null)

  return (
    <Routes>

      <Route path="/" element={<PublicRoute><Login setUser={setUser} /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login setUser={setUser} /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><CreateAccount /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/users" element={<Users />} />
        {/* <Route path="/customer/:id" element={<CustomerOrderList />} /> */}
        <Route path="/catalog/categories" element={<Category />} />
        <Route path="/catalog/categories/:id" element={<ViewCategory />} />
        <Route path="/catalog/attributes" element={<Attribute />} />
        <Route path="/catalog/attributes/:id" element={<AttributesValues />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="/edit-profile" element={<ProfileForm />} />
        <Route path="/contact" element={<ContactList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/create" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/blog/edit/:id" element={<CreateBlog />} />
        {/* <Route path="/blog/:id/comments" element={<BlogComments />} /> */}
        <Route path="/blog/comments/:blogId" element={<BlogComments />} />


        <Route path="/reviews" element={<ReviewsList />} />
        <Route path="/reviews/top-businesses" element={<TopBusinesses />} />
        <Route path="/reviews/business/:id" element={<BusinessReviews />} />
        <Route path="/reviews/edit/:id" element={<EditReview />} />




        <Route path="/coupons" element={<Coupon />} />


        <Route path="/referral/*" element={<ReferralMain />} />



        {/* Business Routes (Salon and Freelancers) */}
        <Route path="/businesses/salons" element={<SalonsList />} />
        <Route path="/businesses/salons/:id" element={<SalonDetails />} />
        <Route path="/businesses/salons/edit/:id" element={<EditSalon />} />
        <Route path="/businesses/freelancers" element={<FreelancersList />} />
        <Route path="/businesses/freelancers/:id" element={<FreelancerDetails />} />
        <Route path="/businesses/freelancers/edit/:id" element={<EditFreelancer />} />

        {/* Banners */}
        <Route path="/banners" element={<BannersList />} />
        <Route path="/banners/create" element={<CreateBanner />} />
        <Route path="/banners/edit/:id" element={<EditBanner />} />

      </Route>
    </Routes>
  );
}

export default App;