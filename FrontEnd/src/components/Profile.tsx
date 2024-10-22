/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../environments/environment';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface JobSeeker {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  resume: string | null;
  profileImg: string | null;
  gender: string;
  status: string;
  Agency: {
    contact: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImg: string | null;
  } | null;
}

interface Agency {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string | null;
  gender: string;
  JobSeekers: JobSeeker[];
}

const Profile: React.FC  = () => {
  const [userData, setUserData] = useState<JobSeeker | Agency | null>(null);
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();
  console.log(status)

  const updateStatus = async (agencyId: number, jobSeekerId: number, status: string) => {
    const token: any = localStorage.getItem('token');
    try {
      const response = await axios.post(`${baseURL}accept-job-seeker`, { agencyId, jobSeekerId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      console.log(response.data);
      setStatus(response.data.status);
      if (response.data.success) {
        toast.success('Status updated successfully');
        setUserData((prevData) => {
          if (!prevData || !('JobSeekers' in prevData)) return prevData;
          return {
            ...prevData,
            JobSeekers: prevData.JobSeekers.map((jobSeeker) =>
              jobSeeker.id === jobSeekerId ? { ...jobSeeker, status } : jobSeeker
            ),
          };
        });
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token: any = localStorage.getItem('token');
        if (!token) {
          return navigate('/login');
        }
        const decoded: any = jwtDecode(token);
        const { userId } = decoded.id;
        const response = await axios.get(`${baseURL}userDetails/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        setUserData(response.data);

      } catch (error) {
        console.error('Error fetching user details:', error);

      }
    };

    fetchUser();
  }, [navigate]);

  if (!userData) {
    navigate('/login');
    return null;
    // return <div className="text-center">User not found.</div>;
  }
  const handleChat = () => {
    if (isJobSeeker(userData)) {
      navigate(`/chat/${userData.id}/${userData.Agency?.id}`);
    } else {
      // Assuming you want to navigate to the chat with the first job seeker
      if (userData.JobSeekers.length > 0) {
        navigate(`/chat/${userData.JobSeekers[0].id}/${userData.id}`);
      } else {
        toast.error('No job seekers available for chat');
      }
    } 
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Successfully Logged Out');
    navigate('/login');
  };

  const isJobSeeker = (user: JobSeeker | Agency): user is JobSeeker => {
    return (user as JobSeeker).Agency !== undefined;
  };

  return (
    <div className="container mt-5 aling">
      <h2 className="text-center mb-4 profile-header">{isJobSeeker(userData) ? 'Job Seeker Profile' : 'Agency Profile'}</h2>
      <div className="card mb-4 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">{userData.firstName} {userData.lastName}</h3>
          <p className="card-text"><strong>Email:</strong> {userData.email}</p>
          <p className="card-text"><strong>Gender:</strong> {userData.gender}</p>
          {isJobSeeker(userData) && (
            <p className="card-text"><strong>Status:</strong> {userData.status}</p>
          )}
          {userData.profileImg && (
            <img src={`${baseURL}${userData.profileImg}`} alt="profileImg" className="img-fluid rounded agency-img  " />
          )}
          {isJobSeeker(userData) && (
            <>
              <p className="card-text"><strong>Contact: </strong> {userData.contact}</p>
              {userData.resume && (
                <p className="card-text">
                  <strong>Resume:</strong> <a href={`${baseURL}${userData.resume}`} target="_blank" className="btn btn-link resume-link">Download</a>
                </p>
              )}

              {userData.Agency && (
                <div className="mt-4">
                  <h4>Agency Details:</h4>
                  <p><strong>Name:</strong> {userData.Agency.firstName} {userData.Agency.lastName}</p>
                  <p><strong>Email:</strong> {userData.Agency.email}</p>
                  <p><strong>Contact No:</strong> {userData.Agency.contact}</p>
                  {userData.Agency.profileImg && (
                    <img src={`${baseURL}${userData.Agency.profileImg}`} alt="Agency" className="img-fluid rounded agency-img" />
                  )}
                </div>
              )}
            </>
          )}

          {!isJobSeeker(userData) && (
            <div className="mt-4">
              <h4>Job Seekers:</h4>
              <ul className="list-group">
                {userData.JobSeekers.map(jobSeeker => (
                  <li key={jobSeeker.id} className="list-group-item job-seeker-item">
                    <strong>{jobSeeker.firstName} {jobSeeker.lastName}</strong> - {jobSeeker.email}<br />
                    <span>Contact: {jobSeeker.contact}</span><br />
                    <span>Gender: {jobSeeker.gender}</span><br />
                    <span>Status: {jobSeeker.status}</span><br />
                    {jobSeeker.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => updateStatus(userData.id, jobSeeker.id, 'accepted')}
                          className='btn btn-success btn-sm'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(userData.id, jobSeeker.id, 'rejected')}
                          className='btn btn-danger btn-sm'
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        {jobSeeker.status === 'accepted' ? (
                          
                          <button
                            onClick={() => updateStatus(userData.id, jobSeeker.id, 'rejected')}
                            className='btn btn-danger btn-sm'
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(userData.id, jobSeeker.id, 'accepted')}
                            className='btn btn-success btn-sm'
                          >
                            Accept
                          </button>
                        )}
                      </>
                    )}
                    {userData.JobSeekers.length > 0 && jobSeeker.status === 'accepted' && (
                <button onClick={handleChat} className="btn btn-primary btn-sm ">
                  Chat
                </button>
                )}
                    {jobSeeker.resume && <a href={`${baseURL}${jobSeeker.resume}`} target="_blank" className="btn btn-link">Download Resume</a>}
                    
                  </li>
                ))}
              </ul>
                
            </div>

          )}
        </div>
      </div>


      <button onClick={handleLogout} className="btn mb-5 btn-danger ">
        Logout
      </button>
    </div>
  );
};

export default Profile;