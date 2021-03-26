import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

function UsersList({users}) {
    let rows = users.map((user) => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
      </tr>
    ));
  
    return (
      <div>
        <Row>
          <Col>
            <h2>List Users</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    );
}

export default connect(({users}) => ({users}))(UsersList);