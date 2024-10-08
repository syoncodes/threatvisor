'use client';

import orderBy from 'lodash/orderBy';
import { useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// _mock
import { POST_SORT_OPTIONS } from 'src/_mock';
// api
import {  useSearchPosts } from 'src/api/blog';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostSort from '../post-sort';
import PostDetailsHero from '../post-details-hero';
import PostDetailsToolbar from '../post-details-toolbar';
import { POST_PUBLISH_OPTIONS } from 'src/_mock';

import PostSearch from '../post-search';
import PostListHorizontal from '../post-list-horizontal';
import { useEffect } from 'react';
import axios from 'axios';
import Markdown from 'src/components/markdown';
// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

// ----------------------------------------------------------------------
// Place this outside of the PostListView component
const useGetPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://threatvisor-api.vercel.app/api/featured');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
};


export default function PostListView() {
  const settings = useSettingsContext();
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const [selectedPost, setSelectedPost] = useState(null);
  const [publish, setPublish] = useState('');
  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };
  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  // Function to handle back to list view
  const handleBackToList = () => {
    setSelectedPost(null);
  };
  // Use the hook here
  const { posts, loading: postsLoading } = useGetPosts();
  
  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
    sortBy,
  });
  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);
  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );
  if (selectedPost) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <PostDetailsToolbar
        onBackClick={handleBackToList}
        editLink={paths.dashboard.post.edit(`${selectedPost?.title}`)}
        liveLink={paths.post.details(`${selectedPost?.title}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={POST_PUBLISH_OPTIONS}
      />
        <PostDetailsHero title={selectedPost.title} coverUrl={`data:image/jpeg;base64,${selectedPost.coverUrl}`} />
        <Stack
        spacing={3}
        sx={{
          maxWidth: 720,
          mx: 'auto',
          mt: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {selectedPost.description}
        </Typography>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {selectedPost.head1}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {selectedPost.article1}
        </Typography>
        <img src={`data:image/jpeg;base64,${selectedPost.img1URL}`} alt="Image 1" style={{ maxWidth: '100%', borderRadius: '10px' }} />
        <Typography variant="h4" sx={{ mb: 5 }}>
          {selectedPost.head2}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {selectedPost.article2}
        </Typography>
        <img src={`data:image/jpeg;base64,${selectedPost.img2URL}`} alt="Image 2" style={{ maxWidth: '100%', borderRadius: '10px'  }} />
        <Typography variant="h4" sx={{ mb: 5 }}>
          {selectedPost.head3}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {selectedPost.article3}
        </Typography>
        </Stack>
        
      </Container>
    );
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.post.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          null
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || 'default'}
              >
                {tab === 'all' && posts.length}

                
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal
        posts={dataFiltered}
        loading={postsLoading}
        onSelectPost={handleSelectPost} // Passing onSelectPost here
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  const { publish } = filters;

  return inputData;
};
