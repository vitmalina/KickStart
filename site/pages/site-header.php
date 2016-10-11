<?
global $site_root; global $page;
$ip = explode(".", $_SERVER['REMOTE_ADDR']);
// filter out some IPs
?>

<!-- Top Menu -->

<div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container">
      <div class="nav-collapse collapse">
        <div class="pull-right">
          <a class="brand" href="<?=$site_root?>/home">KickStart</a>
        </div>
        <ul class="nav">
          <li <?=$page == "home" ? 'class="active"' : ''?>>
            <a href="<?=$site_root?>/home">Home</a>
          </li>
          <li <?=$page == "docs" ? 'class="active"' : ''?>>
            <a href="<?=$site_root?>/docs">Docs</a>
          </li>
          <li <?=$page == "blog" ? 'class="active"' : ''?>>
            <a href="/web/blog">Blog</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>