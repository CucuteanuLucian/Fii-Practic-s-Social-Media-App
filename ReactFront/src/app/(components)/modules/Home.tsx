import Navbar from '@/app/(components)/Navbar';
import ViewPosts from '@/app/(components)/posts/ViewPosts';

const HomePage: React.FC = () => {
    return (
        <>
            <Navbar />
            <ViewPosts />
        </>
    );
};

export default HomePage;
