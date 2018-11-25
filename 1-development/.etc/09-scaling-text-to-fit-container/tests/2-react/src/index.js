const React        = require('react')
const ReactDOM     = require('react-dom')

const Folder       = require('./components/Sidebar/Folder')

const get_folders  = () => {
  const folders      = []
  const static_props = {
    folder_name: "Folder",
    title:       "Folder",
    onClick:     () => {},
    active:      false
  }

  for (let i=0; i<5; i++) {
    folders.push(
      <Folder {...static_props} unread_count={Math.pow(10,i)} key={i} />
    )
  }

  return folders
}

const folders = get_folders()

ReactDOM.render(
  <div className="top-component app">
    <div className="component sidebar">
      {folders}
    </div>
  </div>,
  document.getElementById('root')
)
