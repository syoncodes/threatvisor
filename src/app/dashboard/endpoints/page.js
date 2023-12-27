// sections
import { EndpointListView } from 'src/sections/overview/endpoints/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: File',
};

export default function OrgFilePage() {
  return (
    <>
      <EndpointListView />
    </>
  );
}
